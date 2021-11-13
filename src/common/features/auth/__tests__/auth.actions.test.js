import {
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    logoutRequest,
    logoutSuccess,
    logoutFailure
} from '../auth.actions';

describe('auth.actions.js', () => {
    it('should export correct action types', () => {
        expect([LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE]).toEqual([
            'LOGOUT_REQUEST',
            'LOGOUT_SUCCESS',
            'LOGOUT_FAILURE'
        ]);
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
            const error = new Error('logoutFailure');

            expect(logoutFailure(error)).toEqual({
                type: LOGOUT_FAILURE,
                payload: error,
                error: true
            });
        });
    });
});
