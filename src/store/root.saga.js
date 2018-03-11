import { all, fork } from 'redux-saga/effects';
import { watchAuth } from '../features/auth';

export default function* rootSaga() {
    yield all([fork(watchAuth)]);
}
