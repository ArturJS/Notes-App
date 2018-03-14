export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST';
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE';
export const addNote = ({ title, description, files }) => ({
    type: ADD_NOTE_REQUEST,
    payload: {
        title,
        description,
        files
    }
});
export const addNoteSucceeded = ({ id, title, description, files }) => ({
    type: ADD_NOTE_SUCCESS,
    payload: {
        id,
        title,
        description,
        files
    }
});
export const addNoteFailed = () => ({
    type: ADD_NOTE_FAILURE
});

export const UPDATE_NOTE_REQUEST = 'UPDATE_NOTE_REQUEST';
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';
export const updateNote = ({ id, title, description, files }) => ({
    type: UPDATE_NOTE_REQUEST,
    payload: {
        id,
        title,
        description,
        files
    }
});
export const updateNoteSucceeded = id => ({
    type: UPDATE_NOTE_SUCCESS,
    payload: {
        id
    }
});
export const updateNoteFailed = id => ({
    type: UPDATE_NOTE_FAILURE,
    payload: {
        id
    }
});

export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';
export const deleteNote = id => ({
    type: DELETE_NOTE_REQUEST,
    payload: {
        id
    }
});
export const deleteNoteSucceeded = id => ({
    type: DELETE_NOTE_SUCCESS,
    payload: {
        id
    }
});
export const deleteNoteFailed = id => ({
    type: DELETE_NOTE_FAILURE,
    payload: {
        id
    }
});

export const GET_ALL_NOTES_REQUEST = 'GET_ALL_NOTES_REQUEST';
export const GET_ALL_NOTES_SUCCESS = 'GET_ALL_NOTES_SUCCESS';
export const GET_ALL_NOTES_FAILURE = 'GET_ALL_NOTES_FAILURE';
export const getAllNotes = () => ({
    type: GET_ALL_NOTES_REQUEST
});
export const getAllNotesSucceeded = notes => ({
    type: GET_ALL_NOTES_SUCCESS,
    payload: {
        notes: notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            files: note.files
        }))
    }
});
export const getAllNotesFailed = () => ({
    type: GET_ALL_NOTES_FAILURE
});

export const CHANGE_NOTE_ORDER_REQUEST = 'CHANGE_NOTE_ORDER_REQUEST';
export const CHANGE_NOTE_ORDER_SUCCESS = 'CHANGE_NOTE_ORDER_SUCCESS';
export const CHANGE_NOTE_ORDER_FAILURE = 'CHANGE_NOTE_ORDER_FAILURE';
export const changeNoteOrder = ({
    id,
    oldIndex,
    newIndex,
    commitChanges = false
}) => ({
    type: CHANGE_NOTE_ORDER_REQUEST,
    payload: {
        id,
        oldIndex,
        newIndex,
        commitChanges
    }
});
export const changeNoteOrderSucceeded = id => ({
    type: CHANGE_NOTE_ORDER_SUCCESS,
    payload: {
        id
    }
});
export const changeNoteOrderFailed = id => ({
    type: CHANGE_NOTE_ORDER_FAILURE,
    payload: {
        id
    }
});
