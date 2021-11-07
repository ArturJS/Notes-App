import _ from 'lodash';
import {
    take,
    all,
    fork,
    put,
    select,
    call,
    actionChannel
} from 'redux-saga/effects';
import { ensureState } from 'redux-optimistic-ui';
import { notesApi } from '../../api';
import {
    ADD_NOTE_REQUEST,
    addNoteSuccess,
    addNoteFailure,
    UPDATE_NOTE_REQUEST,
    updateNoteSuccess,
    updateNoteFailure,
    DELETE_NOTE_REQUEST,
    deleteNoteSuccess,
    deleteNoteFailure,
    GET_ALL_NOTES_REQUEST,
    getAllNotesSuccess,
    getAllNotesFailure,
    CHANGE_NOTE_ORDER_REQUEST,
    changeNoteOrderSuccess,
    changeNoteOrderFailure
} from './notes.actions';

function* watchAddNote() {
    while (true) {
        try {
            const { payload } = yield take(ADD_NOTE_REQUEST);
            const { title, description, files } = payload;

            const newNote = yield call(() =>
                notesApi.create({
                    title,
                    description,
                    files
                })
            );

            yield put(addNoteSuccess(newNote));
        } catch (error) {
            yield put(addNoteFailure());
        }
    }
}

function* watchUpdateNote() {
    while (true) {
        const { payload } = yield take(UPDATE_NOTE_REQUEST);
        const { id, title, description } = payload;

        try {
            yield call(() => notesApi.update({ id, title, description }));
            yield put(
                updateNoteSuccess({
                    id,
                    title,
                    description
                })
            );
        } catch (error) {
            yield put(updateNoteFailure(id));
        }
    }
}

function* watchDeleteNote() {
    while (true) {
        const { payload } = yield take(DELETE_NOTE_REQUEST);
        const { id } = payload;

        try {
            yield call(() => notesApi.remove(id));

            yield put(deleteNoteSuccess(id));
        } catch (error) {
            yield put(deleteNoteFailure(id));
        }
    }
}

function* watchGetAllNotes() {
    while (true) {
        yield take(GET_ALL_NOTES_REQUEST);

        try {
            const notes = yield call(() => notesApi.getAll());

            yield put(getAllNotesSuccess(notes));
        } catch (error) {
            yield put(getAllNotesFailure());
        }
    }
}

function* watchChangeNoteOrder() {
    const reorderingActionsQueue = yield actionChannel(
        CHANGE_NOTE_ORDER_REQUEST
    );

    while (true) {
        const { payload } = yield take(reorderingActionsQueue);
        const { id, commitChanges } = payload;

        if (!commitChanges) {
            continue; // eslint-disable-line no-continue
        }

        try {
            const notes = yield select(state => ensureState(state.notes));
            const reorderedNoteIndex = _.findIndex(
                notes,
                note => note.id === id
            );

            if (reorderedNoteIndex > 0) {
                const { id: anchorNoteId } = notes[reorderedNoteIndex - 1];

                yield call(() =>
                    notesApi.insertBefore({ noteId: id, anchorNoteId })
                );
            } else {
                const { id: anchorNoteId } = notes[reorderedNoteIndex + 1];

                yield call(() =>
                    notesApi.insertAfter({ noteId: id, anchorNoteId })
                );
            }

            yield put(changeNoteOrderSuccess(id));
        } catch (error) {
            yield put(changeNoteOrderFailure(id));
        }
    }
}

export default function* watchNotes() {
    yield all([
        fork(watchAddNote),
        fork(watchUpdateNote),
        fork(watchDeleteNote),
        fork(watchGetAllNotes),
        fork(watchChangeNoteOrder)
    ]);
}
