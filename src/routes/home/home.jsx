import { h, Component } from 'preact';
import 'react-grid-layout/css/styles.css';
import _ from 'lodash';
import AddNoteForm from './components/add-note-form';
import Note from './components/note';
import firebaseProvider from '../../providers/firebase-provider';

import style from './home.scss';

export default class Home extends Component {
    state = {
        notes: []
    };

    componentDidMount() {
        firebaseProvider.auth.onAuthStateChanged(user => {
            if (user) {
                this.getNotes(user.uid);
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

    getNotes = uid => {
        firebaseProvider.database
            .ref(`users/${uid}/notes`)
            .on('value', snapshot => {
                const notesMap = snapshot.val();
                const notes = _.entries(notesMap).map(([id, note]) => ({
                    id,
                    title: note.title,
                    description: note.description
                }));
                this.setState({ notes });
            });
    };

    onAddNote = note => {
        this.setState(({ notes }) => {
            const lastIndex = notes.length;

            return {
                notes: [
                    ...notes,
                    {
                        id: lastIndex.toString(),
                        ...note
                    }
                ],
                layouts: {
                    lg: _.times(lastIndex, i => ({
                        i: i.toString(),
                        x: i,
                        y: Math.floor(i / 2),
                        w: 1,
                        h: 1
                    }))
                }
            };
        });
    };

    onEditNote = () => {};

    render() {
        const { notes } = this.state;

        return (
            <div className={style.home}>
                <AddNoteForm onAddNote={this.onAddNote} />
                <div className={'react-grid-layout'}>
                    {notes.map(note => (
                        <div key={note.id} className={'react-grid-item'}>
                            <Note note={note} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
