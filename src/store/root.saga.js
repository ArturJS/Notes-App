import { all, fork } from 'redux-saga/effects';
import { watchAuth } from '../features/auth';
import { watchNotes } from '../features/notes';

export default function* rootSaga() {
    yield all([fork(watchAuth), fork(watchNotes)]);
}
