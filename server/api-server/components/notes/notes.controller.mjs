import _ from 'lodash';
import notesService from './notes.service';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

class NotesController {
    async getAll(ctx) {
        const userEmail = _.get(ctx, 'session.passport.user.user.email');
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

    async remove(ctx) {
        const noteId = +ctx.params.id;

        await notesService.remove(noteId);

        ctx.body = { id: noteId };
    }
}

export default new NotesController();
