import db from '../../common/models';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

const withinTransaction = async processingCallback => {
    const transaction = await db.sequelize.transaction({
        isolationLevel: db.Sequelize.Transaction.SERIALIZABLE
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
        await withinTransaction(async transaction => {
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

            await this._connectOldSiblings(note, transactionParams);

            const newSiblings = getNewSiblings(reorderingType, anchorNote);

            await insertBetweenSiblings(
                {
                    targetNoteId: noteId,
                    newPrevId: newSiblings.prevId,
                    newNextId: newSiblings.nextId
                },
                transactionParams
            );
        });
    }

    async remove(userId, noteId) {
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

    async hasAccessToNotes(userId, noteIds) {
        const notes = await db.Notes.findAll({
            where: {
                id: noteIds,
                userId
            }
        });

        return notes.length === noteIds.length;
    }

    async _connectOldSiblings(targetNote, transactionParams) {
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

            return !(firstNote && lastNote);
        };
        const isBrokenReference = notes => {
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
