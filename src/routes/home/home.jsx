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

    getNotes = () => {
        this.getNotesRef().on('value', snapshot => {
            const notesMap = snapshot.val();
            const notes = _.entries(notesMap)
                .map(([id, note]) => ({
                    id,
                    title: note.title,
                    description: note.description,
                    files: note.files,
                    prev: note.prev,
                    next: note.next
                }))
                .reverse();
            this.setState({ notes });
        });
    };

    onMoveNote = (dragIndex, hoverIndex) => {
        if (_.isUndefined(dragIndex) || _.isUndefined(hoverIndex)) {
            return;
        }
        const notes = [...this.state.notes];
        const dragNote = notes[dragIndex];

        // remove from dragIndex and insert into hoverIndex
        [[dragIndex, 1], [hoverIndex, 0, dragNote]].forEach(args => {
            notes.splice.apply(notes, args); // eslint-disable-line
        });

        this.setState({
            notes
        });
    };

    onDropNote = (dragIndex, hoverIndex) => {
        console.log('dragIndex ', dragIndex, ' hoverIndex ', hoverIndex);
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
