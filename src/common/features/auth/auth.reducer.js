import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    LOGIN_SUCCESS
} from './auth.actions';

const initialState = {
    isLoggedIn: false,
    isLogoutPending: false,
    isLogoutSuccess: null,
    authData: {
        email: null
    }
};

/* eslint-disable no-param-reassign */
const authReducer = handleActions(
    {
        [LOGOUT_REQUEST]: (state) =>
            produce(state, (draftState) => {
                draftState.isLogoutPending = true;
            }),

        [LOGOUT_SUCCESS]: (state) =>
            produce(state, (draftState) => {
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = true;
                draftState.isLoggedIn = false;
                draftState.authData = initialState.authData;
            }),

        [LOGOUT_FAILURE]: (state) =>
            produce(state, (draftState) => {
                draftState.isLoggedIn = false;
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = false;
            }),

        [LOGIN_SUCCESS]: (state) =>
            produce(state, (draftState) => {
                draftState.isLoggedIn = true;
            })
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default authReducer;
