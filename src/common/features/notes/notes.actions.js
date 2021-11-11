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

const addActions = createActions(
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

export const addNoteRequest = addActions.addNoteRequest;
export const addNoteSuccess = addActions.addNoteSuccess;
export const addNoteFailure = addActions.addNoteFailure;


export const UPDATE_NOTE_REQUEST = 'UPDATE_NOTE_REQUEST';
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';

const updateActions = createActions({
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

export const updateNoteRequest = updateActions.updateNoteRequest;
export const updateNoteSuccess = updateActions.updateNoteSuccess;
export const updateNoteFailure = updateActions.updateNoteFailure;


export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';

const deleteActions = createActions({
    [DELETE_NOTE_REQUEST]: withOptimistic(id => ({ id })),
    [DELETE_NOTE_SUCCESS]: withOptimistic(id => ({ id })),
    [DELETE_NOTE_FAILURE]: withOptimistic(id => ({ id }))
});

export const deleteNoteRequest = deleteActions.deleteNoteRequest;
export const deleteNoteSuccess = deleteActions.deleteNoteSuccess;
export const deleteNoteFailure = deleteActions.deleteNoteFailure;


export const GET_ALL_NOTES_REQUEST = 'GET_ALL_NOTES_REQUEST';
export const GET_ALL_NOTES_SUCCESS = 'GET_ALL_NOTES_SUCCESS';
export const GET_ALL_NOTES_FAILURE = 'GET_ALL_NOTES_FAILURE';

const getAllActions = createActions({
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

export const getAllNotesRequest = getAllActions.getAllNotesRequest;
export const getAllNotesSuccess = getAllActions.getAllNotesSuccess;
export const getAllNotesFailure = getAllActions.getAllNotesFailure;


export const CHANGE_NOTE_ORDER_REQUEST = 'CHANGE_NOTE_ORDER_REQUEST';
export const CHANGE_NOTE_ORDER_SUCCESS = 'CHANGE_NOTE_ORDER_SUCCESS';
export const CHANGE_NOTE_ORDER_FAILURE = 'CHANGE_NOTE_ORDER_FAILURE';

const changeOrderActions = createActions({
    [CHANGE_NOTE_ORDER_REQUEST]: withOptimistic(
        ({ id, oldIndex, newIndex, commitChanges }) => ({
            id,
            oldIndex,
            newIndex,
            commitChanges
        })
    ),
    [CHANGE_NOTE_ORDER_SUCCESS]: withOptimistic(id => ({ id })),
    [CHANGE_NOTE_ORDER_FAILURE]: withOptimistic(id => ({ id }))
});

export const changeNoteOrderRequest = changeOrderActions.changeNoteOrderRequest;
export const changeNoteOrderSuccess = changeOrderActions.changeNoteOrderSuccess;
export const changeNoteOrderFailure = changeOrderActions.changeNoteOrderFailure;


export const CLEAR_NOTES = 'CLEAR_NOTES';
export const clearNotes = createAction(CLEAR_NOTES);
