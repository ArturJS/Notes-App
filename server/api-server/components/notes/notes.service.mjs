import notesDAL from './notes.dal';

const mapNote = note => ({
    id: note.id,
    title: note.title,
    description: note.description,
    files: note.files || []
});

class NotesService {
    async getAll(userEmail) {
        const notes = await notesDAL.getAll(userEmail);

        return notes.map(mapNote);
    }

    async getById(userEmail, noteId) {
        const note = await notesDAL.getById(userEmail, noteId);

        return mapNote(note);
    }

    async create(userEmail, note) {
        const createdNote = await notesDAL.create(userEmail, note);

        return mapNote(createdNote);
    }

    async update(userEmail, note) {
        const updatedNote = await notesDAL.update(userEmail, note);

        return mapNote(updatedNote);
    }

    async remove(userEmail, noteId) {
        await notesDAL.remove(userEmail, noteId);
    }
}

export default new NotesService();
