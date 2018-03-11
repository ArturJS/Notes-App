export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const login = () => ({
    type: LOGIN_REQUEST
});

export const loginSucceeded = ({ email, id }) => ({
    type: LOGIN_SUCCESS,
    payload: {
        email,
        id
    }
});

export const loginFailed = () => ({
    type: LOGIN_FAILURE
});

export const logout = () => ({
    type: LOGOUT_REQUEST
});

export const logoutSucceeded = () => ({
    type: LOGOUT_SUCCESS
});

export const logoutFailed = () => ({
    type: LOGOUT_FAILURE
});
