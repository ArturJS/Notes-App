import { createActions } from 'redux-actions';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const { loginRequest, loginSuccess, loginFailure } = createActions({
    [LOGIN_REQUEST]: () => {},
    [LOGIN_SUCCESS]: ({ email }) => ({ email }),
    [LOGIN_FAILURE]: error => error
});

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const { logoutRequest, logoutSuccess, logoutFailure } = createActions({
    [LOGOUT_REQUEST]: () => {},
    [LOGOUT_SUCCESS]: () => {},
    [LOGOUT_FAILURE]: error => error
});
