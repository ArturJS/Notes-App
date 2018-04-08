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
        const userEmail = getUserEmail(ctx);
        const noteId = +ctx.params.id;

        const note = await notesService.getById(userEmail, noteId);

        ctx.body = mapNote(note);
    }

    async create(ctx) {
        const note = ctx.request.body;
        // todo validate with ajv and explicitly map request body
        const userEmail = getUserEmail(ctx);
        const createdNote = await notesService.create(userEmail, note);

        ctx.body = mapNote(createdNote);
    }

    async update(ctx) {
        const note = ctx.request.body;
        // todo validate with ajv and explicitly map request body
        const userEmail = getUserEmail(ctx);
        const updatedNote = await notesService.create(userEmail, note);

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
        const userEmail = getUserEmail(ctx);

        await notesService.remove(userEmail, noteId);
    }
}

export default new NotesController();
