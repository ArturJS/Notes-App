import { combineReducers } from 'redux';
import { authReducer } from '../features/auth';

export default combineReducers({
    auth: authReducer
});
