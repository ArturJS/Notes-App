import db from '~/server/common/models';
import logger from '~/server/common/logger';
import { TFile } from '~/server/components/files/files.service';
import { withCache } from './utils';
import { REORDERING_TYPES_TYPE } from './notes.enums';

type TNoteEssential = {
    title: string;
    description: string;
    files?: TFile[];
};

type TNoteFull = TNoteEssential & {
    id: number;
    files: TFile[];
};

const mapNote = (note) => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

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
        const notes = await this._getSortedNotesByUserId(userId);

        return notes.map(mapNote);
    }

    async getById(userId: number, noteId: number): Promise<TNoteFull | null> {
        const note = await db.notes.findUnique({
            where: { id: noteId }
        });

        if (!note) {
            return null;
        }

        return mapNote(note);
    }

    async create(userId: number, note: TNoteEssential): Promise<TNoteFull> {
        // @ts-ignore
        const createdNote = await db.$transaction(async (db) => {
            const [lastNote] = await db.notes.findMany({
                where: { nextId: null }
            });
            // eslint-disable-next-line no-shadow
            const createdNote = await db.notes.create({
                data: {
                    title: note.title,
                    description: note.description,
                    files: note.files || [],
                    prevId: lastNote ? lastNote.id : null,
                    nextId: null,
                    userId
                }
            });

            if (lastNote) {
                await db.notes.update({
                    data: {
                        nextId: createdNote.id
                    },
                    where: {
                        id: lastNote.id
                    }
                });
            }

            return createdNote;
        });

        return mapNote(createdNote);
    }

    async update(userId: number, note: TNoteFull): Promise<TNoteFull> {
        const noteId = note.id;
        const updatedNote = await db.notes.update({
            data: note,
            where: {
                id: noteId
            }
        });

        return mapNote(updatedNote);
    }

    async reorder(params: {
        noteId: number;
        reorderingType: REORDERING_TYPES_TYPE;
        anchorNoteId: number;
    }): Promise<void> {
        const { noteId, reorderingType, anchorNoteId } = params;

        console.log({
            noteId,
            reorderingType,
            anchorNoteId
        });

        // @ts-ignore
        await db.$transaction(async (db) => {
            const insertBetweenSiblings = async ({
                targetNoteId,
                newPrevId = null,
                newNextId = null
            }) => {
                await db.notes.update({
                    data: {
                        prevId: newPrevId,
                        nextId: newNextId
                    },
                    where: {
                        id: targetNoteId
                    }
                });

                if (newNextId) {
                    await db.notes.update({
                        data: { prevId: targetNoteId },
                        where: {
                            id: newNextId
                        }
                    });
                }

                if (newPrevId) {
                    await db.notes.update({
                        data: { nextId: targetNoteId },
                        where: {
                            id: newPrevId
                        }
                    });
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
            const [note, anchorNote] = await Promise.all([
                db.notes.findUnique({
                    where: {
                        id: noteId
                    }
                }),
                db.notes.findUnique({
                    where: {
                        id: anchorNoteId
                    }
                })
            ]);
            const newSiblings = getNewSiblings(reorderingType, anchorNote);

            await insertBetweenSiblings({
                targetNoteId: noteId,
                newPrevId: newSiblings.prevId,
                newNextId: newSiblings.nextId
            });

            await this._connectOldSiblings(db, note);
        });
    }

    async remove(userId: number, noteId: number): Promise<void> {
        // @ts-ignore
        await db.$transaction(async (db) => {
            const targetNote = await db.notes.findUnique({
                where: {
                    id: noteId
                }
            });

            await this._connectOldSiblings(db, targetNote);

            await db.notes.destroy({
                where: {
                    id: noteId
                }
            });
        });
    }

    async hasAccessToNotes(
        userId: number,
        noteIds: number[]
    ): Promise<boolean> {
        const notes = await db.notes.findMany({
            where: {
                id: { in: noteIds },
                userId
            }
        });

        return notes.length === noteIds.length;
    }

    async _connectOldSiblings(
        db,
        targetNote: { prevId: number | null; nextId: number | null }
    ): Promise<void> {
        const { prevId, nextId } = targetNote;

        if (prevId) {
            await db.notes.update({
                data: { nextId },
                where: {
                    id: prevId
                }
            });
        }

        if (nextId) {
            await db.notes.update({
                data: { prevId },
                where: {
                    id: nextId
                }
            });
        }
    }

    async _getSortedNotesByUserId(userId: number): Promise<TNoteFull[]> {
        const notesList = await db.notes.findMany({
            where: { userId }
        });

        const isNotFirstAndLastNotesAvailableCheck = (notes) => {
            if (notesList.length === 0) {
                return false;
            }

            const firstNote = notes.find((note) => !note.nextId);
            const lastNote = notes.find((note) => !note.prevId);

            return !(firstNote && lastNote);
        };
        const isBrokenReferenceCheck = (notes) => {
            if (notesList.length === 0) {
                return false;
            }

            const firstNote = notes.find((note) => !note.nextId);
            const passedNotesSet = new Set([firstNote]);
            const getNoteById = (noteId) =>
                notes.find((note) => note.id === noteId);
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
        const isNotFirstAndLastNotesAvailable =
            isNotFirstAndLastNotesAvailableCheck(notesList);
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

            // @ts-ignore
            return notesList;
        }

        if (notesList.length === 0) {
            return [];
        }

        const sortedNotesList = [];
        const getNoteById = (noteId) =>
            notesList.find((note) => note.id === noteId);
        let nextNote = notesList.find((note) => !note.nextId);

        while (nextNote) {
            sortedNotesList.push(nextNote);
            nextNote = getNoteById(nextNote.prevId);
        }

        return sortedNotesList.map(mapNote);
    }

    async _autoFixBrokenRefs(notesIds: number[]): Promise<void> {
        // @ts-ignore
        await db.$transaction(async (db) => {
            const allUpdatesPromises = notesIds.map((noteId, index) => {
                const isFirst = index === 0;
                const isLast = index === notesIds.length - 1;
                const updatePromise = db.notes.update({
                    where: {
                        id: noteId
                    },
                    data: {
                        prevId: isFirst ? null : notesIds[index - 1],
                        nextId: isLast ? null : notesIds[index + 1]
                    }
                });

                return updatePromise;
            });

            return Promise.all(allUpdatesPromises);
        });
    }
}

// @ts-ignore
export default new (decorateWithCache(NotesDAL))();
