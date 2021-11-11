import _ from 'lodash';
import { createActions } from 'redux-actions';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const { logoutRequest, logoutSuccess, logoutFailure } = createActions({
    [LOGOUT_REQUEST]: _.noop,
    [LOGOUT_SUCCESS]: _.noop,
    [LOGOUT_FAILURE]: _.noop
});
