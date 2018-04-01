import notesService from './notes.service';

class NotesController {
    async getAll(ctx) {
        const notes = await notesService.getAll();

        ctx.body = notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files
        }));
    }

    async getById(ctx) {
        const noteId = +ctx.params.id;

        const note = await notesService.getById(noteId);

        ctx.body = {
            id: noteId,
            title: note.title,
            description: note.description,
            files: note.files
        };
    }

    async create(ctx) {
        const note = ctx.request.body;

        const createdNote = await notesService.create(note);

        ctx.body = {
            id: createdNote.id,
            title: createdNote.title,
            description: createdNote.description,
            files: createdNote.files
        };
    }

    async update(ctx) {
        const note = ctx.request.body;

        const updatedNote = await notesService.create(note);

        ctx.body = {
            id: updatedNote.id,
            title: updatedNote.title,
            description: updatedNote.description,
            files: updatedNote.files
        };
    }

    async remove(ctx) {
        const noteId = +ctx.params.id;

        await notesService.remove(noteId);
    }
}

export default new NotesController();
