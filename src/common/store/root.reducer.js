import { combineReducers } from 'redux';
import { authReducer } from '../features/auth';
import { notesReducer } from '../features/notes';

export default combineReducers({
    auth: authReducer,
    notes: notesReducer
});
