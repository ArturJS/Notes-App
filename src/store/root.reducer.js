import { combineReducers } from 'redux';
import { authReducer } from '../features/auth';
import notesReducer from '../features/notes/notes.reducer';

export default combineReducers({
    auth: authReducer,
    notes: notesReducer
});
