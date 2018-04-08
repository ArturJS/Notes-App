import _ from 'lodash';
import notesService from './notes.service';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

const getUserId = ctx => _.get(ctx, 'session.passport.user.id');

class NotesController {
    async getAll(ctx) {
        const userId = getUserId(ctx);
        const notes = await notesService.getAll(userId);

        ctx.body = notes.map(mapNote);
    }

    async getById(ctx) {
        const userId = getUserId(ctx);
        const noteId = +ctx.params.id;

        const note = await notesService.getById(userId, noteId);

        ctx.body = mapNote(note);
    }

    async create(ctx) {
        const note = ctx.request.body;
        // todo validate with ajv and explicitly map request body
        const userId = getUserId(ctx);
        const createdNote = await notesService.create(userId, note);

        ctx.body = mapNote(createdNote);
    }

    async update(ctx) {
        const note = ctx.request.body;
        // todo validate with ajv and explicitly map request body
        const userId = getUserId(ctx);
        const updatedNote = await notesService.create(userId, note);

        ctx.body = mapNote(updatedNote);
    }

    async reorder(ctx) {
        const userId = getUserId(ctx);
        const { noteId, reorderingType, anchorNoteId } = ctx.request.body;

        await notesService.reorder({
            userId,
            noteId,
            reorderingType,
            anchorNoteId
        });

        ctx.body = '';
    }

    async remove(ctx) {
        const noteId = +ctx.params.id;
        const userId = getUserId(ctx);

        await notesService.remove(userId, noteId);

        ctx.body = '';
    }
}

export default new NotesController();
