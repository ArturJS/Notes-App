import { take, all, fork, put } from 'redux-saga/effects';
import firebaseProvider from '../../providers/firebase-provider';
import {
    LOGIN_REQUEST,
    LOGOUT_REQUEST,
    loginSuccess,
    loginFailure,
    logoutSuccess,
    logoutFailure
} from './auth.actions';

function* watchLogin() {
    while (true) {
        yield take(LOGIN_REQUEST);

        try {
            const { user } = yield firebaseProvider.login();

            yield put(
                loginSuccess({
                    id: user.uid,
                    email: user.email
                })
            );
        } catch (error) {
            yield put(loginFailure());
        }
    }
}

function* watchLogout() {
    while (true) {
        yield take(LOGOUT_REQUEST);

        try {
            yield firebaseProvider.logout();

            yield put(logoutSuccess());
        } catch (error) {
            yield put(logoutFailure());
        }
    }
}

export default function* watchAuth() {
    yield all([fork(watchLogin), fork(watchLogout)]);
}
