import produce from 'immer';
import { handleActions } from 'redux-actions';
import { optimistic } from 'redux-optimistic-ui';
import _ from 'lodash';
import {
    ADD_NOTE_REQUEST,
    ADD_NOTE_SUCCESS,
    UPDATE_NOTE_SUCCESS,
    GET_ALL_NOTES_SUCCESS,
    CHANGE_NOTE_ORDER_REQUEST,
    CLEAR_NOTES,
    UPDATE_NOTE_REQUEST,
    DELETE_NOTE_REQUEST
} from './notes.actions';

let tempId = -1;
const generateTempId = () => {
    tempId -= 1;

    return tempId;
};
const attachTransactionId = (payload, meta) => ({
    ...payload,
    meta: {
        transactionId: meta.optimistic.id
    }
});
const detachTransactionId = payload => ({
    ...payload,
    meta: {
        ..._.omit(payload.meta, 'transactionId')
    }
});
const updateNoteByIndex = ({ draftState, index, payload }) => {
    if (index < 0) {
        // eslint-disable-next-line no-console
        console.warn(`Couldn't find note to update!`);

        return;
    }

    const isDefined = value => !_.isUndefined(value);

    _.extend(draftState[index], _.pickBy(payload, isDefined));
};
const updateByTransactionId = (state, { payload, meta }) =>
    produce(state, draftState => {
        const transactionId = meta.optimistic.id;
        const index = _.findIndex(
            draftState,
            note => _.get(note, 'meta.transactionId') === transactionId
        );

        updateNoteByIndex({
            draftState,
            index,
            payload: detachTransactionId(payload)
        });
    });

const initialState = [];

/* eslint-disable no-param-reassign */
const notesReducer = handleActions(
    {
        [ADD_NOTE_REQUEST]: (state, { payload, meta }) =>
            produce(state, draftState => {
                const note = attachTransactionId(payload, meta);

                note.id = generateTempId();

                draftState.unshift(note);
            }),
        [ADD_NOTE_SUCCESS]: updateByTransactionId,

        [UPDATE_NOTE_REQUEST]: (state, { payload, meta }) =>
            produce(state, draftState => {
                const { id } = payload;
                const index = _.findIndex(draftState, note => note.id === id);

                if (index < 0) {
                    /* eslint-disable no-console */
                    console.warn(`Couldn't find note to update!`);
                    console.warn('id', id);
                    console.warn('typeof id', typeof id);
                    console.warn('draftState', draftState);
                    console.warn();
                    /* eslint-enable no-console */

                    return;
                }

                updateNoteByIndex({
                    draftState,
                    index,
                    payload: attachTransactionId(payload, meta)
                });
            }),
        [UPDATE_NOTE_SUCCESS]: (state, { meta }) =>
            produce(state, draftState => {
                const transactionId = meta.optimistic.id;
                const noteIndex = _.findIndex(
                    draftState,
                    note => _.get(note, 'meta.transactionId') === transactionId
                );

                if (noteIndex < 0) {
                    // eslint-disable-next-line no-console
                    console.warn(`Couldn't find note to update!`);

                    return;
                }

                const note = draftState[noteIndex];

                _.extend(note, detachTransactionId(note));
            }),

        [DELETE_NOTE_REQUEST]: (state, { payload }) =>
            produce(state, draftState => {
                _.remove(draftState, note => note.id === payload.id);
            }),

        [GET_ALL_NOTES_SUCCESS]: (state, { payload }) => payload.notes,

        [CHANGE_NOTE_ORDER_REQUEST]: (state, { payload }) =>
            produce(state, draftState => {
                const { oldIndex, newIndex } = payload;
                const relatedNote = draftState[oldIndex];

                // remove from oldIndex
                draftState.splice(oldIndex, 1);
                // insert into newIndex
                draftState.splice(newIndex, 0, relatedNote);
            }),

        [CLEAR_NOTES]: () => []
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default optimistic(notesReducer);
