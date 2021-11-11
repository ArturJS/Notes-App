import { createSelector } from 'reselect';

export const getAuthState = createSelector(
    state => state.auth,
    auth => ({
        isLoggedIn: auth.isLoggedIn,
        isLogoutPending: auth.isLogoutPending,
        isLogoutSuccess: auth.isLogoutSuccess,
        authData: {
            email: auth.authData.email
        }
    })
);

export const isLoggedIn = createSelector(getAuthState, auth => auth.isLoggedIn);
