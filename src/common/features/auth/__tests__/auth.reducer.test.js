import authReducer from '../auth.reducer';

jest.mock('../auth.actions', () => ({
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE: 'LOGOUT_FAILURE'
}));

// eslint-disable-next-line import/first
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE
} from '../auth.actions';

describe('auth.reducer.js', () => {
    describe('LOGIN actions', () => {
        it('should correctly process LOGIN_REQUEST action', () => {
            expect(
                authReducer(
                    {},
                    {
                        type: LOGIN_REQUEST
                    }
                )
            ).toEqual({
                isLoginPending: true
            });
        });

        it('should correctly process LOGIN_SUCCESS action', () => {
            const email = 'test@email.com';

            expect(
                authReducer(
                    {},
                    {
                        type: LOGIN_SUCCESS,
                        payload: {
                            email
                        }
                    }
                )
            ).toEqual({
                isLoginPending: false,
                isLoginSuccess: true,
                isLoggedIn: true,
                authData: {
                    email
                }
            });
        });

        it('should correctly process LOGIN_FAILURE action', () => {
            expect(
                authReducer(
                    {},
                    {
                        type: LOGIN_FAILURE
                    }
                )
            ).toEqual({
                isLoggedIn: false,
                isLoginPending: false,
                isLoginSuccess: false
            });
        });
    });

    describe('LOGOUT actions', () => {
        it('should correctly process LOGOUT_REQUEST action', () => {
            expect(
                authReducer(
                    {},
                    {
                        type: LOGOUT_REQUEST
                    }
                )
            ).toEqual({
                isLogoutPending: true
            });
        });

        it('should correctly process LOGOUT_SUCCESS action', () => {
            expect(
                authReducer(
                    {},
                    {
                        type: LOGOUT_SUCCESS
                    }
                )
            ).toEqual({
                isLogoutPending: false,
                isLogoutSuccess: true,
                isLoggedIn: false,
                authData: {
                    email: null
                }
            });
        });

        it('should correctly process LOGOUT_FAILURE action', () => {
            expect(
                authReducer(
                    {},
                    {
                        type: LOGOUT_FAILURE
                    }
                )
            ).toEqual({
                isLoggedIn: false,
                isLogoutPending: false,
                isLogoutSuccess: false
            });
        });
    });
});
