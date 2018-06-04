import { take, call, put, all, fork } from 'redux-saga/effects';
import { notesActions } from '../../notes';

jest.mock('../../../api', () => ({
    authApi: {
        loginWithGoogle: jest.fn(),
        logout: jest.fn()
    }
}));
jest.mock('../auth.actions', () => ({
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    loginSuccess: jest.fn(() => 'loginSuccess'),
    loginFailure: jest.fn(error => error),
    logoutSuccess: jest.fn(() => 'logoutSuccess'),
    logoutFailure: jest.fn(error => error)
}));

/* eslint-disable import/first */
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_REQUEST,
    loginSuccess,
    loginFailure,
    logoutSuccess,
    logoutFailure
} from '../auth.actions';
import watchAuth, {
    watchAnonymousMode,
    watchLogin,
    watchLoginSuccess,
    watchLogout
} from '../auth.saga';
import { authApi } from '../../../api';
/* eslint-enable import/first */

describe('auth.saga.js', () => {
    describe('watchLogin', () => {
        it('should process SUCCESS of authApi.loginWithGoogle()', () => {
            const generator = watchLogin();

            expect(generator.next().value).toEqual(take(LOGIN_REQUEST));

            const loginPayload = {
                user: {
                    email: 'test@mail.com'
                }
            };

            expect(generator.next().value).toEqual(
                call(authApi.loginWithGoogle)
            );
            expect(generator.next(loginPayload).value).toEqual(
                put(loginSuccess(loginPayload.user))
            );
        });

        it('should process FAILURE of authApi.loginWithGoogle()', () => {
            const generator = watchLogin();
            const error = new Error('login error');

            expect(generator.next().value).toEqual(take(LOGIN_REQUEST));
            expect(generator.next().value).toEqual(
                call(authApi.loginWithGoogle)
            );
            expect(generator.throw(error).value).toEqual(
                put(loginFailure(error))
            );
        });
    });

    describe('watchLoginSuccess', () => {
        it('should process LOGIN_SUCCESS action', () => {
            const generator = watchLoginSuccess();

            expect(generator.next().value).toEqual(take(LOGIN_SUCCESS));
            expect(generator.next().value).toEqual(
                put(notesActions.getAllNotesRequest())
            );
        });
    });

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
        it('should fork only "watchAnonymousMode", "watchLogin", "watchLoginSuccess", "watchLogout"', () => {
            const generator = watchAuth();

            expect(generator.next().value).toEqual(
                all([
                    fork(watchAnonymousMode),
                    fork(watchLogin),
                    fork(watchLoginSuccess),
                    fork(watchLogout)
                ])
            );
        });
    });
});
