import { take, all, fork, put, call } from 'redux-saga/effects';
import { authApi } from '../../api';
import {
    LOGIN_SUCCESS,
    LOGOUT_REQUEST,
    logoutSuccess,
    logoutFailure
} from './auth.actions';
import { ANONYMOUS_MODE_READY } from '../anonymous-mode/anonymous-mode.actions';
import { removeNotesApiInterceptor } from '../anonymous-mode/api-interceptors/notes.api-interceptor';
import { notesActions } from '../notes';

export function* watchLogin() {
    while (true) {
        yield take(LOGIN_SUCCESS);
        removeNotesApiInterceptor();
        yield put(notesActions.getAllNotesRequest());
    }
}

export function* watchAnonymousMode() {
    while (true) {
        yield take(ANONYMOUS_MODE_READY);
        yield put(notesActions.getAllNotesRequest());
    }
}

export function* watchLogout() {
    while (true) {
        yield take(LOGOUT_REQUEST);

        try {
            yield call(authApi.logout);

            yield put(logoutSuccess());
            yield put(notesActions.getAllNotesRequest());
        } catch (error) {
            yield put(logoutFailure(error));
        }
    }
}

export default function* watchAuth() {
    yield all([fork(watchAnonymousMode), fork(watchLogout), fork(watchLogin)]);
}
