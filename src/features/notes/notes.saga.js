import _ from 'lodash';
import { take, all, fork, put, select, call } from 'redux-saga/effects';
import firebaseProvider from '../../providers/firebase-provider';
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

const getNotesRef = () => firebaseProvider.getCurrentUserData().child('notes');
const getNoteRefById = id => getNotesRef().child(id);
const getLastNote = ({ notes }) => {
    if (notes.length === 0) {
        return null;
    }

    return _.find(notes, note => !note.next);
};
const updateLastNoteRef = async (newNoteId, lastNote) => {
    if (!lastNote) {
        return;
    }

    await getNotesRef()
        .child(lastNote.id)
        .update({
            next: newNoteId
        });
};
const createNote = async ({ title, description, files }, lastNote) => {
    let prevNoteId = null;

    if (lastNote) {
        prevNoteId = lastNote.id;
    }

    const notesRef = getNotesRef();
    const newNoteId = notesRef.push().key;

    await notesRef.child(newNoteId).update({
        title,
        description,
        files: files.map(({ file, storagePath }) => ({
            name: file.name,
            storagePath
        })),
        prev: prevNoteId
    });

    return {
        id: newNoteId,
        title,
        description,
        files,
        prev: prevNoteId
    };
};
const connectSiblings = async (prevId, nextId) => {
    if (prevId) {
        await getNoteRefById(prevId).update({
            next: nextId || null
        });
    }

    if (nextId) {
        await getNoteRefById(nextId).update({
            prev: prevId || null
        });
    }
};
const mapNotes = initialNotesMap => {
    // Important! Notes order is reversed!
    if (_.isEmpty(initialNotesMap)) {
        return [];
    }

    const notesMap = _.mapValues(initialNotesMap, (note, id) => ({
        id,
        title: note.title,
        description: note.description,
        files: note.files || [],
        prev: note.prev || null,
        next: note.next || null
    }));
    const notes = _.values(notesMap);
    const firstNote = _.find(notes, note => !note.next);
    const lastNote = _.find(notes, note => !note.prev);

    if (!firstNote || !lastNote) {
        // todo create notes validator
        /* eslint-disable no-console */
        console.error('Invalid notes data in Database!');
        console.error(
            `firstNote: ${JSON.stringify(
                firstNote
            )}, lastNote: ${JSON.stringify(firstNote)}`
        );
        /* eslint-enable no-console */

        return [];
    }

    const result = [firstNote];
    const passedNotesSet = new Set(result);
    let nextNote = notesMap[firstNote.prev];

    while (nextNote) {
        // TODO: move into separate check of circular links
        if (passedNotesSet.has(nextNote)) {
            /* eslint-disable no-console */
            console.error('Circular links in database!');
            console.error(`note: ${JSON.stringify(nextNote)}`);
            /* eslint-enable no-console */

            return [];
        }
        passedNotesSet.add(nextNote);
        result.push(nextNote);
        nextNote = notesMap[nextNote.prev];
    }

    return result;
};
const fetchNotes = async () =>
    new Promise(resolve => {
        getNotesRef().once('value', snapshot => {
            const notesMap = snapshot.val();
            const notes = mapNotes(notesMap);

            resolve(notes);
        });
    });
const setupPrevNextRefs = notes => {
    const notesWithPrevNextRefs = notes.map((note, index) => ({
        ...note,
        prev: notes[index + 1] ? notes[index + 1].id : null,
        next: notes[index - 1] ? notes[index - 1].id : null
    }));

    return _.mapKeys(notesWithPrevNextRefs, ({ id }) => id);
};
const updateAllNotes = async notes => {
    const notesWithPrevNextRefs = setupPrevNextRefs(notes);

    await getNotesRef().set(notesWithPrevNextRefs);
};
const removeRelatedFiles = async note => {
    const { files } = note;

    if (!files) {
        return Promise.resolve();
    }

    const removeFilesPromises = files.map(file =>
        firebaseProvider.storage
            .ref()
            .child(file.storagePath)
            .delete()
    );

    return Promise.all(removeFilesPromises);
};

function* watchAddNote() {
    while (true) {
        try {
            const { payload } = yield take(ADD_NOTE_REQUEST);
            const { title, description, files } = payload;
            const lastNote = yield select(getLastNote);
            const newNote = yield call(() =>
                createNote({ title, description, files }, lastNote)
            );

            yield call(() => updateLastNoteRef(newNote.id, lastNote));

            yield put(
                addNoteSuccess({
                    id: newNote.id,
                    title: newNote.title,
                    description: newNote.description,
                    files: newNote.files,
                    prev: newNote.prev
                })
            );
            yield put(
                updateNoteSuccess({
                    id: lastNote.id,
                    next: newNote.id
                })
            );
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
            yield call(() => getNoteRefById(id).update({ title, description }));
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
            const notes = yield select(state => state.notes);
            const noteToDelete = _.find(notes, note => note.id === id);

            if (!noteToDelete) {
                /* eslint-disable no-console */
                console.warn(`Couldn't find note to delete!`);
                console.warn('id', id);
                console.warn('typeof id', typeof id);
                console.warn();
                /* eslint-enable no-console */

                return;
            }

            yield call(() =>
                connectSiblings(noteToDelete.prev, noteToDelete.next)
            );
            yield call(() => removeRelatedFiles(noteToDelete));
            yield call(() => getNoteRefById(id).remove());

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
            const notes = yield call(fetchNotes);

            yield put(getAllNotesSuccess(notes));
        } catch (error) {
            yield put(getAllNotesFailure());
        }
    }
}

function* watchChangeNoteOrder() {
    while (true) {
        const { payload } = yield take(CHANGE_NOTE_ORDER_REQUEST);
        const { id, commitChanges } = payload;

        if (!commitChanges) {
            continue; // eslint-disable-line no-continue
        }

        try {
            const notes = yield select(state => state.notes);

            yield call(() => updateAllNotes(notes));

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
