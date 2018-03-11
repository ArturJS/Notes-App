import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { pure } from 'recompose';

import { authSelectors } from '../../features/auth';
import AddNoteForm from './components/add-note-form';
import NotesList from './components/notes-list';
import firebaseProvider from '../../providers/firebase-provider';
import './home.scss';

function mapStateToProps(state) {
    const { isLoggedIn } = authSelectors.getAuthState(state);

    return {
        isLoggedIn
    };
}

@connect(mapStateToProps)
@pure
export default class Home extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool
    };

    static defaultProps = {
        isLoggedIn: false
    };

    constructor(props) {
        super(props);

        this.state = {
            notes: []
        };
    }

    componentDidMount() {
        this.updateNotesList(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateNotesList(nextProps);
    }

    updateNotesList = ({ isLoggedIn }) => {
        if (isLoggedIn) {
            this.fetchNotes();
        } else {
            this.clearNotes();
        }
    };

    fetchNotes = () => {
        this.getNotesRef().once('value', this.getNotes);
    };

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
            files: note.files || [],
            prev: note.prev || null,
            next: note.next || null
        }));
        const notes = _.values(notesMap);
        const firstNote = _.find(notes, note => !note.next);
        const lastNote = _.find(notes, note => !note.prev);

        if (!firstNote || !lastNote) {
            // todo create notes validator
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
            // TODO: move into separate check of circular links
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

    getNotes = snapshot => {
        const notesMap = snapshot.val();
        const notes = this.mapNotes(notesMap);

        this.setState({ notes });
    };

    setupPrevNextRefs(notes) {
        const notesWithPrevNextRefs = notes.map((note, index) => ({
            ...note,
            prev: notes[index + 1] ? notes[index + 1].id : null,
            next: notes[index - 1] ? notes[index - 1].id : null
        }));

        return _.mapKeys(notesWithPrevNextRefs, ({ id }) => id);
    }

    updateAllNotes = _.debounce(notes => {
        const notesWithPrevNextRefs = this.setupPrevNextRefs(notes);

        this.getNotesRef().set(notesWithPrevNextRefs);
    }, 1500);

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

    onDropNote = () => {
        const { notes } = this.state;

        this.updateAllNotes(notes);
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
