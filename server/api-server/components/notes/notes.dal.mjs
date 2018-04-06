import db from '../../common/models';
import { ErrorNotFound } from '../../common/exceptions';

class NotesDAL {
    async getAll(userEmail) {
        const notes = await this._getSortedNotesByUserEmail(
            userEmail,
            'get notes'
        );

        return notes.map(note => ({
            // todo check correctness
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files || []
        }));
    }

    async getById(userEmail, noteId) {
        const user = await this._getUserByEmail(
            userEmail,
            `get note with noteId="${noteId}"`
        );

        return user.notes.find(note => note.id === noteId);
    }

    async create(userEmail, note) {
        const user = await this._getUserByEmail(userEmail, 'create note');

        const createdNote = await db.Note.create({
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files || [],
            prevId: note.prevId,
            nextId: note.nextId,
            userId: user.id
        });

        return createdNote;
    }

    async update(note) {
        const noteId = note.id;
        const updatedNote = await db.Note.update(note, {
            where: {
                id: noteId
            }
        });

        return updatedNote;
    }

    async remove(noteId) {
        await db.Note.destroy({ where: { id: noteId } });
    }

    async _getUserByEmail(email, operationDescription) {
        const user = await db.User.find({
            where: {
                email
            }
        });

        if (!user) {
            throw new ErrorNotFound(
                `Cannot ${operationDescription} by user email="${email}"!`
            );
        }

        return user;
    }

    async _getSortedNotesByUserEmail(email) {
        const user = await this._getUserByEmail(email, 'get notes');
        const { notes: notesList } = user;

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
            console.error('Inconsistent data in database!');
            console.error('Cannot find first or last note!');
            console.error(
                `Notes for email="${email}" will be returned as is...`
            );

            return notesList; // todo: probably we should fix broken references???
        }

        if (isBrokenReference(notesList)) {
            console.error('Inconsistent data in database!');
            console.error('Broken references in database!');
            console.error(
                `Notes for email="${email}" will be returned as is...`
            );

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
