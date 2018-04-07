import db from '../../common/models';
import { ErrorNotFound } from '../../common/exceptions';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

class NotesDAL {
    async getAll(userEmail) {
        const notes = await this._getSortedNotesByUserEmail(
            userEmail,
            'get notes'
        );

        return notes.map(mapNote);
    }

    async getById(userEmail, noteId) {
        const user = await this._getUserByEmail(
            userEmail,
            `get note with noteId="${noteId}"`
        );
        const note = await db.Notes.findOne({
            where: { id: noteId, userId: user.id }
        });

        return mapNote(note);
    }

    async create(userEmail, note) {
        const user = await this._getUserByEmail(userEmail, 'create note');

        const createdNote = await db.Notes.create({
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files || [],
            prevId: note.prevId,
            nextId: note.nextId,
            userId: user.id
        });

        return mapNote(createdNote);
    }

    async update(userEmail, note) {
        const user = await this._getUserByEmail(userEmail, 'update note');
        const noteId = note.id; // todo check user access (and throw an error if it's absent)
        const updatedNote = await db.Notes.update(note, {
            where: {
                id: noteId,
                userId: user.id
            }
        });

        return mapNote(updatedNote);
    }

    async remove(userEmail, noteId) {
        const user = await this._getUserByEmail(userEmail, 'remove note'); // todo check user access (and throw an error if it's absent)

        await db.Notes.destroy({ where: { id: noteId, userId: user.id } });
    }

    async _getUserByEmail(email, operationDescription) {
        const user = await db.Users.find({
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
        const notesList = await db.Notes.findAll({
            where: { userId: user.id }
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
