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

export default (state = initialState, action) => {
    const { type, payload } = action;
    const produceState = callback => produce(state, callback);

    /* eslint-disable no-param-reassign */
    switch (type) {
        case LOGIN_REQUEST:
            return produceState(draftState => {
                draftState.isLoginPending = true;
            });
        case LOGIN_SUCCESS:
            return produceState(draftState => {
                draftState.isLoginPending = false;
                draftState.isLoginSuccess = true;
                draftState.isLoggedIn = true;
                draftState.authData = {
                    email: payload.email,
                    id: payload.id
                };
            });
        case LOGIN_FAILURE:
            return produceState(draftState => {
                draftState.isLoggedIn = false;
                draftState.isLoginPending = false;
                draftState.isLoginSuccess = false;
            });
        case LOGOUT_REQUEST:
            return produceState(draftState => {
                draftState.isLogoutPending = true;
            });
        case LOGOUT_SUCCESS:
            return produceState(draftState => {
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = true;
                draftState.isLoggedIn = false;
                draftState.authData = initialState.authData;
            });
        case LOGOUT_FAILURE:
            return produceState(draftState => {
                draftState.isLoggedIn = false;
                draftState.isLogoutPending = false;
                draftState.isLogoutSuccess = false;
            });
        default:
            return state;
    }

    /* eslint-enable no-param-reassign */
};
