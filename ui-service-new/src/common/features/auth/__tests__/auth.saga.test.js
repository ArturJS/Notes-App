import { take, call, put, all, fork } from 'redux-saga/effects';
import { notesActions } from '../../notes';

jest.mock('../../../api', () => ({
    authApi: {
        logout: jest.fn()
    }
}));
jest.mock('../auth.actions', () => ({
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    logoutSuccess: jest.fn(() => 'logoutSuccess'),
    logoutFailure: jest.fn(error => error)
}));

/* eslint-disable import/first */
import { LOGOUT_REQUEST, logoutSuccess, logoutFailure } from '../auth.actions';
import watchAuth, { watchAnonymousMode, watchLogout } from '../auth.saga';
import { authApi } from '../../../api';
/* eslint-enable import/first */

describe('auth.saga.js', () => {
    describe('watchLogout', () => {
        it('should process SUCCESS of authApi.logout()', () => {
            const generator = watchLogout();

            expect(generator.next().value).toEqual(take(LOGOUT_REQUEST));
            expect(generator.next().value).toEqual(call(authApi.logout));
            expect(generator.next().value).toEqual(put(logoutSuccess()));
            expect(generator.next().value).toEqual(
                put(notesActions.getAllNotesRequest())
            );
        });

        it('should process FAILURE of authApi.logout()', () => {
            const generator = watchLogout();
            const error = new Error('logout error');

            expect(generator.next().value).toEqual(take(LOGOUT_REQUEST));
            expect(generator.next().value).toEqual(call(authApi.logout));
            expect(generator.throw(error).value).toEqual(
                put(logoutFailure(error))
            );
        });
    });

    describe('watchAuth', () => {
        it('should fork only "watchAnonymousMode", "watchLogout"', () => {
            const generator = watchAuth();

            expect(generator.next().value).toEqual(
                all([fork(watchAnonymousMode), fork(watchLogout)])
            );
        });
    });
});
