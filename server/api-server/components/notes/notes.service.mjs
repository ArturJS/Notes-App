import {
    ErrorNotFound,
    ErrorAccessDenied,
    ErrorBadRequest
} from '../../common/exceptions';
import { REORDERING_TYPES } from './notes.enums';
import notesDAL from './notes.dal';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

type NoteRequest = {
    title: string,
    description: string
};

class NotesService {
    async getAll(userId: number) {
        const notes = await notesDAL.getAll(userId);

        return notes.map(mapNote);
    }

    async getById(userId, noteId) {
        await this._checkAccessToNotes(userId, [noteId]);

        const note = await notesDAL.getById(userId, noteId);

        if (!note) {
            throw new ErrorNotFound(`Note by id="${noteId}" not found!`);
        }

        return mapNote(note);
    }

    async create(userId, note: NoteRequest) {
        const createdNote = await notesDAL.create(userId, note);

        return mapNote(createdNote);
    }

    async update(userId, note) {
        await this._checkAccessToNotes(userId, [note.id]);

        const updatedNote = await notesDAL.update(userId, note);

        return mapNote(updatedNote);
    }

    async reorder({ userId, noteId, reorderingType, anchorNoteId }) {
        // todo introduce validators
        const checkReorderingType = reorderType => {
            const wrongReorderingType =
                [
                    REORDERING_TYPES.INSERT_BEFORE,
                    REORDERING_TYPES.INSERT_AFTER
                ].indexOf(reorderType) === -1;

            if (wrongReorderingType) {
                throw ErrorBadRequest([
                    `Wrong reorderingType="${reorderingType}"!`,
                    `Allowed values ${JSON.stringify(REORDERING_TYPES)}`
                ]);
            }
        };

        checkReorderingType(reorderingType);

        await this._checkAccessToNotes(userId, [noteId, anchorNoteId]);

        await notesDAL.reorder({
            noteId,
            reorderingType,
            anchorNoteId
        });
    }

    async remove(userId, noteId) {
        await notesDAL.remove(userId, noteId);
    }

    async _checkAccessToNotes(userId, noteIds) {
        const userHasAccessToNotes = await notesDAL.hasAccessToNotes(
            userId,
            noteIds
        );

        if (!userHasAccessToNotes) {
            throw new ErrorAccessDenied([
                `The user with userId=${userId} `,
                'do not have an access to one of the following notes ',
                `by ids=${JSON.stringify(noteIds)}`
            ]);
        }
    }
}

export default new NotesService();
