import notesDAL from './notes.dal';

class NotesService {
    async getAll() {
        return await notesDAL.getAll();
    }

    async getById(noteId) {
        return await notesDAL.getById(noteId);
    }

    async create(note) {
        return await notesDAL.create(note);
    }

    async update(note) {
        return await notesDAL.update(note);
    }

    async remove(noteId) {
        await notesDAL.remove(noteId);
    }
}

export default new NotesService();
