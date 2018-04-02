import _ from 'lodash';

class NotesDAL {
    constructor() {
        this._notes = [
            {
                id: 1,
                title: 'Note 1',
                description: 'Some description',
                files: [],
                prev: null,
                next: 2
            },
            {
                id: 2,
                title: 'Note 2',
                description: 'Some description 123',
                files: [],
                prev: 1,
                next: null
            }
        ];
    }

    async getAll() {
        return this._notes;
    }

    async getById(noteId) {
        return this._notes.find(note => note.id === noteId);
    }

    async create(note) {
        const createdNote = {
            id: Math.random(),
            ...note
        };

        this._notes.push(createdNote);

        return createdNote;
    }

    async update(note) {
        const noteId = note.id;
        const relatedNote = this._notes.find(
            noteItem => noteItem.id === noteId
        );

        if (relatedNote) {
            _.extend(relatedNote, note);
        }

        return relatedNote;
    }

    async remove(noteId) {
        _.remove(this._notes, note => note.id === noteId);
    }
}

export default new NotesDAL();
