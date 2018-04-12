import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    logoutFailure
} from '../auth.actions';

describe('auth.actions.js', () => {
    it('should export correct action types', () => {
        expect([
            LOGIN_REQUEST,
            LOGIN_SUCCESS,
            LOGIN_FAILURE,
            LOGOUT_REQUEST,
            LOGOUT_SUCCESS,
            LOGOUT_FAILURE
        ]).toEqual([
            'LOGIN_REQUEST',
            'LOGIN_SUCCESS',
            'LOGIN_FAILURE',
            'LOGOUT_REQUEST',
            'LOGOUT_SUCCESS',
            'LOGOUT_FAILURE'
        ]);
    });

    describe('"loginRequest" action creator', () => {
        it('should return object with correct "type"', () => {
            expect(loginRequest()).toEqual({
                type: LOGIN_REQUEST
            });
        });
    });

    describe('"loginSuccess" action creator', () => {
        it('should return object with correct "type" and "payload"', () => {
            const email = 'test@email.com';

            expect(loginSuccess({ email })).toEqual({
                type: LOGIN_SUCCESS,
                payload: {
                    email
                }
            });
        });
    });

    describe('"loginFailure" action creator', () => {
        it('should return object with correct "type"', () => {
            expect(loginFailure()).toEqual({
                type: LOGIN_FAILURE
            });
        });
    });

    describe('"logoutRequest" action creator', () => {
        it('should return object with correct "type"', () => {
            expect(logoutRequest()).toEqual({
                type: LOGOUT_REQUEST
            });
        });
    });

    describe('"logoutSuccess" action creator', () => {
        it('should return object with correct "type"', () => {
            expect(logoutSuccess()).toEqual({
                type: LOGOUT_SUCCESS
            });
        });
    });

    describe('"logoutFailure" action creator', () => {
        it('should return object with correct "type"', () => {
            expect(logoutFailure()).toEqual({
                type: LOGOUT_FAILURE
            });
        });
    });
});
