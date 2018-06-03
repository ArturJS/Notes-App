import shortId from 'shortid';
import { baseApi } from './base.api';

const mapNote = note => ({
    id: +note.id,
    title: note.title,
    description: note.description,
    files: note.files || [],
    trackId: shortId.generate()
});

export const REORDERING_TYPES = {
    INSERT_BEFORE: 'INSERT_BEFORE',
    INSERT_AFTER: 'INSERT_AFTER'
};

export const notesApi = {
    async getAll(options) {
        const { data: notes } = await baseApi.ajax({
            method: 'get',
            url: '/notes',
            ...options
        });

        return notes.map(mapNote);
    },

    async getById(id) {
        const { data: note } = await baseApi.ajax({
            method: 'get',
            url: `/notes/${id}`
        });

        return mapNote(note);
    },

    async create(note) {
        const { data: createdNote } = await baseApi.ajax({
            method: 'post',
            url: '/notes',
            data: {
                title: note.title,
                description: note.description,
                files: note.files || []
            }
        });

        return mapNote(createdNote);
    },

    async update(note) {
        const { data: updatedNote } = await baseApi.ajax({
            method: 'put',
            url: '/notes',
            data: {
                id: note.id,
                title: note.title,
                description: note.description,
                files: note.files || []
            }
        });

        return mapNote(updatedNote);
    },

    async remove(id) {
        await baseApi.ajax({
            method: 'delete',
            url: `/notes/${id}`
        });
    },

    async insertBefore({ noteId, anchorNoteId }) {
        await this._reorder({
            noteId,
            anchorNoteId,
            reorderingType: REORDERING_TYPES.INSERT_BEFORE
        });
    },

    async insertAfter({ noteId, anchorNoteId }) {
        await this._reorder({
            noteId,
            anchorNoteId,
            reorderingType: REORDERING_TYPES.INSERT_AFTER
        });
    },

    async _reorder({ noteId, anchorNoteId, reorderingType }) {
        await baseApi.ajax({
            method: 'post',
            url: '/notes/reorder',
            data: {
                noteId,
                anchorNoteId,
                reorderingType
            }
        });
    }
};
