import { getAuthState } from '../auth.selectors';

describe('auth.selectors.js', () => {
    describe('"getAuthState" selector', () => {
        it('should extract only needed data from state', () => {
            const expectedAuthState = {
                isLoggedIn: true,
                isLoginPending: false,
                isLoginSuccess: true,
                isLogoutPending: false,
                isLogoutSuccess: false,
                authData: {
                    email: 'test@email.com'
                }
            };
            const state = {
                auth: {
                    excessiveInfo: 'some excessive info...',
                    ...expectedAuthState
                }
            };

            expect(getAuthState(state)).toEqual(expectedAuthState);
        });
    });
});
