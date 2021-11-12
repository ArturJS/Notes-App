import {
    ErrorNotFound,
    ErrorAccessDenied,
    ErrorBadRequest
} from '~/server/common/exceptions';
import { REORDERING_TYPES } from './notes.enums';
import { REORDERING_TYPES_TYPE } from './notes.enums';
import notesDAL from './notes.dal';

type TFile = {
    id: number,
    downloadPath: string,
    name: string,
    size: number
};

type TNoteEssential = {
    title: string,
    description: string,
    files?: TFile[]
};

type TNoteFull = TNoteEssential & {
    id: number,
    files: TFile[]
};

const mapNote = (note): TNoteFull => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

class NotesService {
    async getAll(userId: number): Promise<TNoteFull[]> {
        const notes = await notesDAL.getAll(userId);

        return notes.map(mapNote);
    }

    async getById(userId: number, noteId: number): Promise<TNoteFull> {
        await this._checkAccessToNotes(userId, [noteId]);

        const note = await notesDAL.getById(userId, noteId);

        if (!note) {
            throw new ErrorNotFound(`Note by id="${noteId}" not found!`);
        }

        return mapNote(note);
    }

    async create(userId: number, note: TNoteEssential): Promise<TNoteFull> {
        const createdNote = await notesDAL.create(userId, note);

        return mapNote(createdNote);
    }

    async update(userId: number, note: TNoteFull): Promise<TNoteFull> {
        await this._checkAccessToNotes(userId, [note.id]);

        const updatedNote = await notesDAL.update(userId, note);

        return mapNote(updatedNote);
    }

    async reorder(params: {
        userId: number,
        noteId: number,
        reorderingType: REORDERING_TYPES_TYPE,
        anchorNoteId: number
    }): Promise<void> {
        // todo: use params destructuring when
        // todo:    the issue https://github.com/codemix/flow-runtime/issues/201
        // todo:    is fixed
        const { userId, noteId, reorderingType, anchorNoteId } = params;
        // todo introduce validators
        const checkReorderingType = (reorderType: string) => {
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

    async remove(userId: number, noteId: number): Promise<void> {
        await notesDAL.remove(userId, noteId);
    }

    async _checkAccessToNotes(
        userId: number,
        noteIds: number[]
    ): Promise<void> {
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
