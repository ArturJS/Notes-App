import { combineReducers } from 'redux';
import { authReducer } from '../features/auth';
import { notesReducer } from '../features/notes';
import { modalReducer } from '../features/modal';

export default combineReducers({
    auth: authReducer,
    notes: notesReducer,
    modalStack: modalReducer
});
