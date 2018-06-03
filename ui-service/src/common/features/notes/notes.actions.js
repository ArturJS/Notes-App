import { createActions, createAction } from 'redux-actions';

const withOptimistic = payloadCreator => [
    payloadCreator,
    () => ({
        isOptimistic: true,
        synced: false
    })
];

export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST';
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE';
export const { addNoteRequest, addNoteSuccess, addNoteFailure } = createActions(
    {
        [ADD_NOTE_REQUEST]: withOptimistic(({ title, description, files }) => ({
            title,
            description,
            files
        })),
        [ADD_NOTE_SUCCESS]: withOptimistic(
            ({ id, title, description, files, trackId }) => ({
                id,
                title,
                description,
                files,
                trackId
            })
        ),
        [ADD_NOTE_FAILURE]: withOptimistic(() => {})
    }
);

export const UPDATE_NOTE_REQUEST = 'UPDATE_NOTE_REQUEST';
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';
export const {
    updateNoteRequest,
    updateNoteSuccess,
    updateNoteFailure
} = createActions({
    [UPDATE_NOTE_REQUEST]: withOptimistic(({ id, title, description }) => ({
        id,
        title,
        description
    })),
    [UPDATE_NOTE_SUCCESS]: withOptimistic(({ id, title, description }) => ({
        id,
        title,
        description
    })),
    [UPDATE_NOTE_FAILURE]: withOptimistic(id => ({ id }))
});

export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';
export const {
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure
} = createActions({
    [DELETE_NOTE_REQUEST]: withOptimistic(id => ({ id })),
    [DELETE_NOTE_SUCCESS]: withOptimistic(id => ({ id })),
    [DELETE_NOTE_FAILURE]: withOptimistic(id => ({ id }))
});

export const GET_ALL_NOTES_REQUEST = 'GET_ALL_NOTES_REQUEST';
export const GET_ALL_NOTES_SUCCESS = 'GET_ALL_NOTES_SUCCESS';
export const GET_ALL_NOTES_FAILURE = 'GET_ALL_NOTES_FAILURE';
export const {
    getAllNotesRequest,
    getAllNotesSuccess,
    getAllNotesFailure
} = createActions({
    [GET_ALL_NOTES_REQUEST]: () => {},
    [GET_ALL_NOTES_SUCCESS]: notes => ({
        notes: notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files,
            trackId: note.trackId
        }))
    }),
    [GET_ALL_NOTES_FAILURE]: () => {}
});

export const CHANGE_NOTE_ORDER_REQUEST = 'CHANGE_NOTE_ORDER_REQUEST';
export const CHANGE_NOTE_ORDER_SUCCESS = 'CHANGE_NOTE_ORDER_SUCCESS';
export const CHANGE_NOTE_ORDER_FAILURE = 'CHANGE_NOTE_ORDER_FAILURE';
export const {
    changeNoteOrderRequest,
    changeNoteOrderSuccess,
    changeNoteOrderFailure
} = createActions({
    [CHANGE_NOTE_ORDER_REQUEST]: ({
        id,
        oldIndex,
        newIndex,
        commitChanges
    }) => ({
        id,
        oldIndex,
        newIndex,
        commitChanges
    }),
    [CHANGE_NOTE_ORDER_SUCCESS]: id => ({ id }),
    [CHANGE_NOTE_ORDER_FAILURE]: id => ({ id })
});

export const CLEAR_NOTES = 'CLEAR_NOTES';
export const clearNotes = createAction(CLEAR_NOTES);
