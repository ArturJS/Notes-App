import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure } from 'recompose';

import { notesActions, notesSelectors } from '../../features/notes';
import AddNoteForm from './components/add-note-form';
import NotesList from './components/notes-list';
import './home.scss';

function mapStateToProps(state) {
    const notes = notesSelectors.getNotes(state);

    return {
        notes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        notesActions: bindActionCreators(notesActions, dispatch)
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@pure
export default class Home extends Component {
    static propTypes = {
        notes: PropTypes.arrayOf(
            // todo: move into common propTypes
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                files: PropTypes.array,
                prev: PropTypes.string,
                next: PropTypes.string
            }).isRequired
        ).isRequired,
        notesActions: PropTypes.object.isRequired
    };

    changeNoteOrder = ({ oldIndex, newIndex, commitChanges }) => {
        if (_.isUndefined(oldIndex) || _.isUndefined(newIndex)) {
            return;
        }

        const movingNote = this.props.notes[oldIndex];

        this.props.notesActions.changeNoteOrderRequest({
            id: movingNote.id,
            oldIndex,
            newIndex,
            commitChanges
        });
    };

    onMoveNote = (oldIndex, newIndex) => {
        this.changeNoteOrder({
            oldIndex,
            newIndex
        });
    };

    onDropNote = (oldIndex, newIndex) => {
        this.changeNoteOrder({
            oldIndex,
            newIndex,
            commitChanges: true
        });
    };

    render() {
        const { notes } = this.props;

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
