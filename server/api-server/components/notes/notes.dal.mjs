import db from '../../common/models';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

const REORDERING_TYPES = {
    INSERT_BEFORE: 'INSERT_BEFORE',
    INSERT_AFTER: 'INSERT_AFTER'
};

class NotesDAL {
    async getAll(userId) {
        const notes = await this._getSortedNotesByUserId(userId, 'get notes');

        return notes.map(mapNote);
    }

    async getById(userId, noteId) {
        const note = await db.Notes.findOne({
            where: { id: noteId, userId }
        });

        if (!note) {
            return null;
        }

        return mapNote(note);
    }

    async create(userId, note) {
        const lastNote = await db.Notes.findOne({
            where: { nextId: null }
        });
        const transaction = await db.sequelize.transaction();
        const createdNote = await db.Notes.create(
            {
                title: note.title,
                description: note.description,
                files: note.files || [],
                prevId: lastNote ? lastNote.id : null,
                nextId: null,
                userId
            },
            { transaction }
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
                { transaction }
            );
        }

        await transaction.commit();

        return mapNote(createdNote);
    }

    async update(userId, note) {
        const noteId = note.id;
        const updatedNote = await db.Notes.update(note, {
            where: {
                id: noteId,
                userId
            }
        });

        return mapNote(updatedNote);
    }

    async reorder({ noteId, reorderingType, anchorNoteId }) {
        const transaction = await db.sequelize.transaction();
        const [note, anchorNote] = await Promise.all([
            db.Notes.findOne(
                {
                    where: {
                        id: noteId
                    }
                },
                { transaction }
            ),
            db.Notes.findOne(
                {
                    where: {
                        id: anchorNoteId
                    }
                },
                { transaction }
            )
        ]);
        const insertBetweenSiblings = async (
            { targetNoteId, newPrevId = null, newNextId = null },
            { transaction } // eslint-disable-line no-shadow
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
                { transaction }
            );

            if (newNextId) {
                await db.Notes.update(
                    { prevId: targetNoteId },
                    {
                        where: {
                            id: newNextId
                        }
                    },
                    { transaction }
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
                    { transaction }
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

        await this._connectOldSiblings(note, { transaction });

        const newSiblings = getNewSiblings(reorderingType, anchorNote);

        await insertBetweenSiblings(
            {
                targetNoteId: noteId,
                newPrevId: newSiblings.prevId,
                newNextId: newSiblings.nextId
            },
            { transaction }
        );

        await transaction.commit();
    }

    async remove(userId, noteId) {
        const transaction = await db.sequelize.transaction();
        const targetNote = await db.Notes.findOne(
            {
                where: {
                    id: noteId
                }
            },
            { transaction }
        );

        await this._connectOldSiblings(targetNote, { transaction });

        await db.Notes.destroy(
            {
                where: {
                    id: noteId,
                    userId
                }
            },
            { transaction }
        );

        await transaction.commit();
    }

    async hasAccessToNotes(userId, noteIds) {
        const notes = await db.Notes.findAll({
            where: {
                id: noteIds,
                userId
            }
        });

        return notes.length === noteIds.length;
    }

    async _connectOldSiblings(targetNote, { transaction }) {
        const { prevId, nextId } = targetNote;

        if (prevId) {
            await db.Notes.update(
                { nextId },
                {
                    where: {
                        id: prevId
                    }
                },
                { transaction }
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
                { transaction }
            );
        }
    }

    async _getSortedNotesByUserId(userId) {
        const notesList = await db.Notes.findAll({
            where: { userId }
        });

        if (notesList.length === 0) {
            return [];
        }

        const isNotFirstAndLastNotesAvailable = notes => {
            const firstNote = notes.find(note => !note.nextId);
            const lastNote = notes.find(note => !note.prevId);

            return !!(firstNote && lastNote);
        };
        const isBrokenReference = notes => {
            const firstNote = notes.find(notes, note => !note.nextId);
            const passedNotesSet = new Set([firstNote]);
            const getNoteById = noteId =>
                notes.find(note => note.id === noteId);
            let nextNote = getNoteById(firstNote.prevId);

            while (nextNote) {
                if (passedNotesSet.has(nextNote)) {
                    return true;
                }

                passedNotesSet.add(nextNote);
                nextNote = getNoteById(firstNote.prevId);
            }

            if (!nextNote && passedNotesSet.size !== notes.length) {
                return true;
            }

            return false;
        };

        if (isNotFirstAndLastNotesAvailable(notesList)) {
            // todo use logger
            /* eslint-disable no-console */
            console.error('Inconsistent data in database!');
            console.error('Cannot find first or last note!');
            console.error(
                `Notes for userId="${userId}" will be returned as is...`
            );
            /* eslint-enable no-console */

            return notesList; // todo: probably we should fix broken references???
        }

        if (isBrokenReference(notesList)) {
            /* eslint-disable no-console */
            console.error('Inconsistent data in database!');
            console.error('Broken references in database!');
            console.error(
                `Notes for userId="${userId}" will be returned as is...`
            );
            /* eslint-enable no-console */

            return notesList; // todo: probably we should fix broken references???
        }

        const sortedNotesList = [];
        const getNoteById = noteId =>
            notesList.find(note => note.id === noteId);
        let nextNote = notesList.find(note => !note.nextId);

        while (nextNote) {
            sortedNotesList.push(nextNote);
            nextNote = getNoteById(nextNote.prevId);
        }

        return sortedNotesList;
    }
}

export default new NotesDAL();
