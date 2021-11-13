import {
    addNoteRequest,
    addNoteSuccess,
    addNoteFailure,
    updateNoteRequest,
    updateNoteSuccess,
    updateNoteFailure,
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure,
    getAllNotesRequest,
    getAllNotesSuccess,
    getAllNotesFailure,
    changeNoteOrderRequest,
    changeNoteOrderSuccess,
    changeNoteOrderFailure,
    clearNotes
} from './notes.actions';
import * as _notesSelectors from './notes.selectors';

export const notesActions = {
    addNoteRequest,
    addNoteSuccess,
    addNoteFailure,
    updateNoteRequest,
    updateNoteSuccess,
    updateNoteFailure,
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure,
    getAllNotesRequest,
    getAllNotesSuccess,
    getAllNotesFailure,
    changeNoteOrderRequest,
    changeNoteOrderSuccess,
    changeNoteOrderFailure,
    clearNotes
};
export const notesSelectors = _notesSelectors;
export { default as notesReducer } from './notes.reducer';
export { default as watchNotes } from './notes.saga';
