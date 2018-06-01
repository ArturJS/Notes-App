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

/* eslint-disable no-param-reassign */
const notesReducer = handleActions(
    {
        [ADD_NOTE_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                draftState.unshift(payload);
            }),

        [UPDATE_NOTE_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                const { id } = payload;
                const noteIndex = _.findIndex(
                    draftState,
                    note => note.id === id
                );

                if (noteIndex < 0) {
                    /* eslint-disable no-console */
                    console.warn(`Couldn't find note to update!`);
                    console.warn('id', id);
                    console.warn('typeof id', typeof id);
                    console.warn('draftState', draftState);
                    console.warn();
                    /* eslint-enable no-console */

                    return;
                }

                const isDefined = value => !_.isUndefined(value);

                _.extend(draftState[noteIndex], _.pickBy(payload, isDefined));
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
