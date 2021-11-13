import { select, fork, all, take, put } from 'redux-saga/effects';
import { LOGOUT_SUCCESS } from '../auth/auth.actions';
import { applyNotesApiInterceptor } from './api-interceptors/notes.api-interceptor';
import { anonymousModeReady } from './anonymous-mode.actions';

const isServer = typeof window === 'undefined';

function* interceptAxiosRequestsIfNeeded() {
    const isLoggedIn = yield select(state => state.auth.isLoggedIn);

    if (!isLoggedIn && !isServer) {
        applyNotesApiInterceptor();
        yield put(anonymousModeReady());
    }

    while (true) {
        yield take(LOGOUT_SUCCESS);
        applyNotesApiInterceptor();
        yield put(anonymousModeReady());
    }
}

export default function* watchAnonymousMode() {
    yield all([fork(interceptAxiosRequestsIfNeeded)]);
}
