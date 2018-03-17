import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE
} from './auth.actions';

const initialState = {
    isLoggedIn: null,
    isLoginPending: false,
    isLoginSuccess: null,
    isLogoutPending: false,
    isLogoutSuccess: null,
    authData: {
        email: null,
        id: null
    }
};

/* eslint-disable no-param-reassign */
const authReducer = handleActions(
    {
        [LOGIN_REQUEST]: state =>
            produce(state, draftState => {
                draftState.isLoginPending = true;
            }),

        [LOGIN_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                draftState.isLoginPending = false;
                draftState.isLoginSuccess = true;
                draftState.isLoggedIn = true;
                draftState.authData = {
                    email: payload.email,
                    id: payload.id
                };
            }),

        [LOGIN_FAILURE]: state =>
            produce(state, draftState => {
                draftState.isLoggedIn = false;
                draftState.isLoginPending = false;
                draftState.isLoginSuccess = false;
            }),

        [LOGOUT_REQUEST]: state =>
            produce(state, draftState => {
                draftState.isLogoutPending = true;
            }),

        [LOGOUT_SUCCESS]: state =>
            produce(state, draftState => {
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = true;
                draftState.isLoggedIn = false;
                draftState.authData = initialState.authData;
            }),

        [LOGOUT_FAILURE]: state =>
            produce(state, draftState => {
                draftState.isLoggedIn = false;
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = false;
            })
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default authReducer;
