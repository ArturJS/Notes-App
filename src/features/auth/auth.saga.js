import { take, all, fork, put } from 'redux-saga/effects';
import firebaseProvider from '../../providers/firebase-provider';
import {
    LOGIN_REQUEST,
    LOGOUT_REQUEST,
    loginSucceeded,
    loginFailed,
    logoutSucceeded,
    logoutFailed
} from './auth.actions';

function* watchLogin() {
    while (true) {
        yield take(LOGIN_REQUEST);

        try {
            const { user } = yield firebaseProvider.login();

            yield put(
                loginSucceeded({
                    id: user.uid,
                    email: user.email
                })
            );
        } catch (error) {
            yield put(loginFailed);
        }
    }
}

function* watchLogout() {
    while (true) {
        yield take(LOGOUT_REQUEST);

        try {
            yield firebaseProvider.logout();

            yield put(logoutSucceeded());
        } catch (error) {
            yield put(logoutFailed);
        }
    }
}

export default function* watchAuth() {
    yield all([fork(watchLogin), fork(watchLogout)]);
}
