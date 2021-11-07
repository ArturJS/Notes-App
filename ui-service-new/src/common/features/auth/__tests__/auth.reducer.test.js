import authReducer from '../auth.reducer';

jest.mock('../auth.actions', () => ({
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE: 'LOGOUT_FAILURE'
}));

// eslint-disable-next-line import/first
import {
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE
} from '../auth.actions';

describe('auth.reducer.js', () => {
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
