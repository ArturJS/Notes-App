import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
    ADD_NOTE_SUCCESS,
    UPDATE_NOTE_SUCCESS,
    DELETE_NOTE_SUCCESS,
    GET_ALL_NOTES_SUCCESS,
    CHANGE_NOTE_ORDER_REQUEST,
    CLEAR_NOTES
} from './notes.actions';

const initialState = [];
// todo: use normalized data { [noteId]: note }
/* eslint-disable no-param-reassign */
const notesReducer = handleActions(
    {
        [ADD_NOTE_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                draftState.push({
                    id: payload.id,
                    title: payload.title,
                    description: payload.description,
                    files: payload.files
                });
            }),

        [UPDATE_NOTE_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                const { id } = payload;
                const noteIndex = _.findIndex(
                    draftState,
                    note => note.id === id
                );

                if (noteIndex < 0) {
                    console.warn(`Couldn't find note to update!`);
                    console.warn('id', id);
                    console.warn('typeof id', typeof id);
                    console.warn('draftState', draftState);
                    console.warn();

                    return;
                }

                _.extend(draftState[noteIndex], payload);
            }),

        [DELETE_NOTE_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                _.remove(draftState, note => note.id === payload.id);
            }),

        [GET_ALL_NOTES_SUCCESS]: (state, { payload }) => payload.notes,

        [CHANGE_NOTE_ORDER_REQUEST]: (state, { payload }) =>
            produce(state, draftState => {
                const { oldIndex, newIndex } = payload;
                const relatedNote = draftState[oldIndex];

                // remove from oldIndex and insert into newIndex
                [[oldIndex, 1], [newIndex, 0, relatedNote]].forEach(args => {
                    draftState.splice(...args);
                });
            }),

        [CLEAR_NOTES]: () => []
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default notesReducer;
