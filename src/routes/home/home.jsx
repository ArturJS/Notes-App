import { h, Component } from 'preact';
import _ from 'lodash';

import AddNoteForm from './components/add-note-form';
import NotesList from './components/notes-list';
import firebaseProvider from '../../providers/firebase-provider';
import './home.scss';

export default class Home extends Component {
    state = {
        notes: []
    };

    componentDidMount() {
        firebaseProvider.auth.onAuthStateChanged(user => {
            if (user) {
                this.getNotes();
            } else {
                this.clearNotes();
            }
        });
    }

    clearNotes = () => {
        this.setState({
            notes: []
        });
    };

    getNotesRef = () => firebaseProvider.getCurrentUserData().child('notes');

    getNoteRef = id =>
        firebaseProvider.getCurrentUserData().child(`notes/${id}`);

    mapNotes = initialNotesMap => {
        // Important! Notes order is reversed!
        if (_.isEmpty(initialNotesMap)) {
            return [];
        }

        const notesMap = _.mapValues(initialNotesMap, (note, id) => ({
            id,
            title: note.title,
            description: note.description,
            files: note.files,
            prev: note.prev,
            next: note.next
        }));
        const notes = _.values(notesMap);
        const firstNote = _.find(notes, note => !note.next);
        const lastNote = _.find(notes, note => !note.prev);

        if (!firstNote || !lastNote) {
            console.error('Invalid notes data in Database!');
            console.error(
                `firstNote: ${JSON.stringify(
                    firstNote
                )}, lastNote: ${JSON.stringify(firstNote)}`
            );

            return [];
        }

        const result = [firstNote];
        const passedNotesSet = new Set(result);
        let nextNote = notesMap[firstNote.prev];

        while (nextNote) {
            // TODO: check possible circular links! (in case of inconsistent data in database)
            if (passedNotesSet.has(nextNote)) {
                console.error('Circular links in database!');
                console.error(`note: ${JSON.stringify(nextNote)}`);

                return [];
            }
            passedNotesSet.add(nextNote);
            result.push(nextNote);
            nextNote = notesMap[nextNote.prev];
        }

        return result;
    };

    getNotes = () => {
        this.getNotesRef().on('value', snapshot => {
            const notesMap = snapshot.val();
            const notes = this.mapNotes(notesMap);

            this.setState({ notes });
        });
    };

    connectSiblings = note => {
        const { prev, next } = note;

        if (prev) {
            this.getNoteRef(prev).update({
                next: next || null
            });
        }

        if (next) {
            this.getNoteRef(next).update({
                prev: prev || null
            });
        }
    };

    insertBetweenNotes = (prevNextNotes, note) => {
        const { prevNote, nextNote } = prevNextNotes;

        if (prevNote) {
            this.getNoteRef(prevNote.id).update({
                next: note.id
            });
        }

        if (nextNote) {
            this.getNoteRef(nextNote.id).update({
                prev: note.id
            });
        }

        this.getNoteRef(note.id).update({
            prev: prevNote ? prevNote.id : null,
            next: nextNote ? nextNote.id : null
        });
    };

    updateRelatedNotesRefs = (notes, currentNoteIndex) => {
        const currentNote = notes[currentNoteIndex];

        this.connectSiblings(currentNote);
        this.insertBetweenNotes(
            {
                prevNote: notes[currentNoteIndex + 1],
                nextNote: notes[currentNoteIndex - 1]
            },
            currentNote
        );
    };

    onMoveNote = (dragIndex, hoverIndex) => {
        if (_.isUndefined(dragIndex) || _.isUndefined(hoverIndex)) {
            return;
        }
        const notes = [...this.state.notes];
        const dragNote = notes[dragIndex];

        // remove from dragIndex and insert into hoverIndex
        [[dragIndex, 1], [hoverIndex, 0, dragNote]].forEach(args => {
            notes.splice(...args);
        });

        this.setState({
            notes
        });
    };

    onDropNote = (dragIndex, hoverIndex) => {
        const { notes } = this.state;

        this.updateRelatedNotesRefs(notes, hoverIndex);
    };

    render() {
        const { notes } = this.state;

        return (
            <div className="home-page">
                <AddNoteForm notes={notes} />
                <NotesList
                    notes={notes}
                    onMoveNote={this.onMoveNote}
                    onDropNote={this.onDropNote}
                />
            </div>
        );
    }
}
