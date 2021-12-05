import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import _ from 'lodash';
import { REORDERING_TYPES } from '../../../api/notes.api';
import persistentStorage from '../../../providers/persistent-storage';

const reorder = ({ collection, oldIndex, newIndex }) => {
    const item = collection[oldIndex];

    collection.splice(oldIndex, 1);
    collection.splice(newIndex, 0, item);
};
const getAllNotes = async () => {
    const notes = await persistentStorage.getItem('notes');

    return notes || [];
};
const getIdParam = (url) => {
    let [, noteId] = /\/notes\/(\d+)/.exec(url) || [];

    noteId = +noteId;

    if (!_.isNumber(noteId)) {
        throw new Error(`Url "${url}" doesn't contain numeric noteId param!`);
    }

    return noteId;
};

let mock;

export const removeNotesApiInterceptor = () => {
    mock?.restore();
};

export const applyNotesApiInterceptor = () => {
    mock = new MockAdapter(axios);

    mock.onGet('/notes')
        .reply(async () => {
            const notes = await getAllNotes();

            return [200, notes];
        })
        .onGet(/\/notes\/\d+/)
        .reply(async ({ url }) => {
            const noteId = getIdParam(url);
            const notes = await getAllNotes();
            const note = _.find(notes, ['id', noteId]);

            return [200, note];
        })
        .onPost('/notes')
        .reply(async ({ data }) => {
            const note = JSON.parse(data);
            const notes = await getAllNotes();
            const maxId = (_.maxBy(notes, 'id') || {}).id || 0;
            const nextId = maxId + 1;
            const createdNote = {
                id: nextId,
                title: note.title,
                description: note.description,
                files: []
            };

            notes.unshift(createdNote);
            await persistentStorage.setItem('notes', notes);

            return [200, createdNote];
        })
        .onPut('/notes')
        .reply(async ({ data }) => {
            const note = JSON.parse(data);
            const notes = await getAllNotes();
            const noteIndex = _.findIndex(notes, ['id', note.id]);
            const updatedNote = {
                ...notes[noteIndex],
                ...note
            };

            notes[noteIndex] = updatedNote;

            await persistentStorage.setItem('notes', notes);

            return [200, updatedNote];
        })
        .onDelete(/\/notes\/\d+/)
        .reply(async ({ url }) => {
            const noteId = getIdParam(url);
            const notes = await getAllNotes();

            _.remove(notes, (note) => note.id === noteId);

            await persistentStorage.setItem('notes', notes);

            return [200, {}];
        })
        .onPost('/notes/reorder')
        .reply(async ({ data }) => {
            const { noteId, anchorNoteId, reorderingType } = JSON.parse(data);
            const notes = await getAllNotes();
            const noteIndex = _.findIndex(notes, ['id', noteId]);
            const anchorNoteIndex = _.findIndex(notes, ['id', anchorNoteId]);
            const shouldInsertAfter =
                reorderingType === REORDERING_TYPES.INSERT_AFTER;
            const distIndex = shouldInsertAfter
                ? anchorNoteIndex
                : anchorNoteIndex + 1;

            reorder({
                collection: notes,
                oldIndex: noteIndex,
                newIndex: distIndex
            });

            await persistentStorage.setItem('notes', notes);

            return [200, {}];
        })
        .onAny()
        .passThrough();

    return mock;
};
