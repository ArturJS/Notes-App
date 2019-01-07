// @flow
import db from '@root/common/models';
import logger from '@root/common/logger';
import { withCache } from './utils';
import type { REORDERING_TYPES_TYPE } from './notes.enums';

type TNoteEssential = {|
    title: string,
    description: string,
    files?: TFile[]
|};

type TNoteFull = {|
    ...TNoteEssential,
    id: number,
    files: TFile[]
|};

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

const withinTransaction = async processingCallback => {
    const transaction = await db.sequelize.transaction({
        isolationLevel: 'SERIALIZABLE',
        type: 'EXCLUSIVE'
    });

    try {
        const result = await processingCallback(transaction);

        await transaction.commit();

        return result;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

const REORDERING_TYPES = {
    INSERT_BEFORE: 'INSERT_BEFORE',
    INSERT_AFTER: 'INSERT_AFTER'
};

const decorateWithCache = withCache({
    methods: [
        {
            name: 'getAll',
            refreshCacheAfterCalls: ['create', 'update', 'reorder', 'remove'],
            maxAge: 1000 * 60 * 10, // 10 minutes
            paramNumberAsCacheKey: 0,
            getParamsForCachedMethod: (
                name, // one of `refreshCacheAfterCalls`
                args // with which arguments it is invoked
            ) => {
                if (name === 'reorder') {
                    return [args[0].noteId];
                }

                return [args[0]];
            }
        }
    ]
});

class NotesDAL {
    async getAll(userId: number): Promise<TNoteFull[]> {
        const notes = await this._getSortedNotesByUserId(userId, 'get notes');

        return notes.map(mapNote);
    }

    async getById(userId: number, noteId: number): Promise<?TNoteFull> {
        const note = await db.Notes.findOne({
            where: { id: noteId, userId }
        });

        if (!note) {
            return null;
        }

        return mapNote(note);
    }

    async create(userId: number, note: TNoteEssential): Promise<TNoteFull> {
        const createdNote = await withinTransaction(async transaction => {
            const lastNote = await db.Notes.findOne(
                {
                    where: { nextId: null }
                },
                { transaction, lock: transaction.LOCK.UPDATE }
            );
            // eslint-disable-next-line no-shadow
            const createdNote = await db.Notes.create(
                {
                    title: note.title,
                    description: note.description,
                    files: note.files || [],
                    prevId: lastNote ? lastNote.id : null,
                    nextId: null,
                    userId
                },
                { transaction, lock: transaction.LOCK.UPDATE }
            );

            if (lastNote) {
                await db.Notes.update(
                    {
                        nextId: createdNote.id
                    },
                    {
                        where: {
                            id: lastNote.id
                        }
                    },
                    { transaction, lock: transaction.LOCK.UPDATE }
                );
            }

            return createdNote;
        });

        return mapNote(createdNote);
    }

    async update(userId: number, note: TNoteFull): Promise<TNoteFull> {
        const noteId = note.id;
        const affectedRecords = await db.Notes.update(note, {
            where: {
                id: noteId,
                userId
            },
            returning: true,
            plain: true
        });
        const updatedNote = affectedRecords[1];

        return mapNote(updatedNote);
    }

    async reorder(params: {
        noteId: number,
        reorderingType: REORDERING_TYPES_TYPE,
        anchorNoteId: number
    }): Promise<void> {
        const { noteId, reorderingType, anchorNoteId } = params;

        await withinTransaction(async transaction => {
            const insertBetweenSiblings = async (
                { targetNoteId, newPrevId = null, newNextId = null },
                transactionParams // eslint-disable-line no-shadow
            ) => {
                await db.Notes.update(
                    {
                        prevId: newPrevId,
                        nextId: newNextId
                    },
                    {
                        where: {
                            id: targetNoteId
                        }
                    },
                    transactionParams
                );

                if (newNextId) {
                    await db.Notes.update(
                        { prevId: targetNoteId },
                        {
                            where: {
                                id: newNextId
                            }
                        },
                        transactionParams
                    );
                }

                if (newPrevId) {
                    await db.Notes.update(
                        { nextId: targetNoteId },
                        {
                            where: {
                                id: newPrevId
                            }
                        },
                        transactionParams
                    );
                }
            };
            const getNewSiblings = (reorderType, anchorNoteItem) => {
                if (reorderType === REORDERING_TYPES.INSERT_AFTER) {
                    return {
                        prevId: anchorNoteItem.id,
                        nextId: anchorNoteItem.nextId
                    };
                }

                return {
                    prevId: anchorNoteItem.prevId,
                    nextId: anchorNoteItem.id
                };
            };
            const transactionParams = {
                transaction,
                lock: transaction.LOCK.UPDATE
            };
            const [note, anchorNote] = await Promise.all([
                db.Notes.findOne(
                    {
                        where: {
                            id: noteId
                        }
                    },
                    transactionParams
                ),
                db.Notes.findOne(
                    {
                        where: {
                            id: anchorNoteId
                        }
                    },
                    transactionParams
                )
            ]);
            const newSiblings = getNewSiblings(reorderingType, anchorNote);

            await insertBetweenSiblings(
                {
                    targetNoteId: noteId,
                    newPrevId: newSiblings.prevId,
                    newNextId: newSiblings.nextId
                },
                transactionParams
            );
            await this._connectOldSiblings(note, transactionParams);
        });
    }

    async remove(userId: number, noteId: number): Promise<void> {
        await withinTransaction(async transaction => {
            const transactionParams = {
                transaction,
                lock: transaction.LOCK.UPDATE
            };
            const targetNote = await db.Notes.findOne(
                {
                    where: {
                        id: noteId
                    }
                },
                transactionParams
            );

            await this._connectOldSiblings(targetNote, transactionParams);

            // todo remove related files
            await db.Notes.destroy(
                {
                    where: {
                        id: noteId,
                        userId
                    }
                },
                transactionParams
            );
        });
    }

    async hasAccessToNotes(
        userId: number,
        noteIds: number[]
    ): Promise<boolean> {
        const notes = await db.Notes.findAll({
            where: {
                id: noteIds,
                userId
            }
        });

        return notes.length === noteIds.length;
    }

    async _connectOldSiblings(
        targetNote: { prevId: ?number, nextId: ?number },
        transactionParams
    ): Promise<void> {
        const { prevId, nextId } = targetNote;

        if (prevId) {
            await db.Notes.update(
                { nextId },
                {
                    where: {
                        id: prevId
                    }
                },
                transactionParams
            );
        }

        if (nextId) {
            await db.Notes.update(
                { prevId },
                {
                    where: {
                        id: nextId
                    }
                },
                transactionParams
            );
        }
    }

    async _getSortedNotesByUserId(userId: number): Promise<TNoteFull[]> {
        const notesList = await db.Notes.findAll({
            where: { userId }
        });

        const isNotFirstAndLastNotesAvailableCheck = notes => {
            if (notesList.length === 0) {
                return false;
            }

            const firstNote = notes.find(note => !note.nextId);
            const lastNote = notes.find(note => !note.prevId);

            return !(firstNote && lastNote);
        };
        const isBrokenReferenceCheck = notes => {
            if (notesList.length === 0) {
                return false;
            }

            const firstNote = notes.find(note => !note.nextId);
            const passedNotesSet = new Set([firstNote]);
            const getNoteById = noteId =>
                notes.find(note => note.id === noteId);
            let nextNote = getNoteById(firstNote.prevId);

            while (nextNote) {
                if (passedNotesSet.has(nextNote)) {
                    return true;
                }

                passedNotesSet.add(nextNote);
                nextNote = getNoteById(nextNote.prevId);
            }

            if (passedNotesSet.size !== notes.length) {
                return true;
            }

            return false;
        };
        const isNotFirstAndLastNotesAvailable = isNotFirstAndLastNotesAvailableCheck(
            notesList
        );
        const isBrokenReference = isBrokenReferenceCheck(notesList);
        const isWrongRefs =
            isNotFirstAndLastNotesAvailable || isBrokenReference;

        if (isWrongRefs) {
            logger.error(
                [
                    `Exception in NotesDAL._getSortedNotesByUserId(${userId}) `,
                    'Inconsistent data in database!',
                    isNotFirstAndLastNotesAvailable
                        ? 'Cannot find first or last note!'
                        : 'Broken references in database!',
                    `Notes for userId="${userId}" will be returned as is...`
                ].join('')
            );

            const notesIds = notesList.map(({ id }) => id);

            await this._autoFixBrokenRefs(notesIds);

            return notesList;
        }

        if (notesList.length === 0) {
            return [];
        }

        const sortedNotesList = [];
        const getNoteById = noteId =>
            notesList.find(note => note.id === noteId);
        let nextNote = notesList.find(note => !note.nextId);

        while (nextNote) {
            sortedNotesList.push(nextNote);
            nextNote = getNoteById(nextNote.prevId);
        }

        return sortedNotesList.map(mapNote);
    }

    async _autoFixBrokenRefs(notesIds: number[]): Promise<void> {
        await withinTransaction(async transaction => {
            const allUpdatesPromises = notesIds.map((noteId, index) => {
                const isFirst = index === 0;
                const isLast = index === notesIds.length - 1;
                const updatePromise = db.Notes.update(
                    {
                        prevId: isFirst ? null : notesIds[index - 1],
                        nextId: isLast ? null : notesIds[index + 1]
                    },
                    {
                        where: {
                            id: noteId
                        }
                    },
                    { transaction, lock: transaction.LOCK.UPDATE }
                );

                return updatePromise;
            });

            return Promise.all(allUpdatesPromises);
        });
    }
}

export default new (decorateWithCache(NotesDAL))();
