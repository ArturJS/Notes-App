import { take, all, fork, put, call } from 'redux-saga/effects';
import { authApi } from '../../api';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_REQUEST,
    loginSuccess,
    loginFailure,
    logoutSuccess,
    logoutFailure
} from './auth.actions';
import { notesActions } from '../notes';

export function* watchLogin() {
    while (true) {
        yield take(LOGIN_REQUEST);

        try {
            const { user } = yield call(authApi.loginWithGoogle);

            yield put(
                loginSuccess({
                    email: user.email
                })
            );
        } catch (error) {
            yield put(loginFailure(error));
        }
    }
}

export function* watchLoginSuccess() {
    while (true) {
        yield take(LOGIN_SUCCESS);
        yield put(notesActions.getAllNotesRequest());
    }
}

export function* watchLogout() {
    while (true) {
        yield take(LOGOUT_REQUEST);

        try {
            yield call(authApi.logout);

            yield put(logoutSuccess());
            yield put(notesActions.clearNotes());
        } catch (error) {
            yield put(logoutFailure(error));
        }
    }
}

export default function* watchAuth() {
    yield all([fork(watchLogin), fork(watchLoginSuccess), fork(watchLogout)]);
}
