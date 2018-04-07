import _ from 'lodash';
import notesService from './notes.service';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

const getUserEmail = ctx => _.get(ctx, 'session.passport.user.user.email');

class NotesController {
    async getAll(ctx) {
        const userEmail = getUserEmail(ctx);
        const notes = await notesService.getAll(userEmail);

        ctx.body = notes.map(mapNote);
    }

    async getById(ctx) {
        const noteId = +ctx.params.id;

        const note = await notesService.getById(noteId);

        ctx.body = mapNote(note);
    }

    async create(ctx) {
        const note = ctx.request.body;

        const createdNote = await notesService.create(note);

        ctx.body = mapNote(createdNote);
    }

    async update(ctx) {
        const note = ctx.request.body;

        const updatedNote = await notesService.create(note);

        ctx.body = mapNote(updatedNote);
    }

    async reorder(ctx) {
        const userEmail = getUserEmail(ctx);
        const { noteId, reorderingType, anchorNoteId } = ctx.request.body;

        await notesService.reorder({
            userEmail,
            noteId,
            reorderingType,
            anchorNoteId
        });
    }

    async remove(ctx) {
        const noteId = +ctx.params.id;

        await notesService.remove(noteId);
    }
}

export default new NotesController();
