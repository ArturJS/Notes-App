import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import DNDBackend from 'react-dnd-touch-backend';

import Note from '../note';
import NoteDragPreview from '../note-drag-preview';
import './notes-list.scss';

@DragDropContext(
    DNDBackend({
        enableTouchEvents: true,
        enableMouseEvents: true
    })
)
export default class NotesList extends Component {
    static propTypes = {
        notes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                files: PropTypes.array,
                prev: PropTypes.string,
                next: PropTypes.string
            }).isRequired
        ).isRequired,
        onMoveNote: PropTypes.func.isRequired,
        onDropNote: PropTypes.func.isRequired
    };

    render() {
        const { notes, onMoveNote, onDropNote } = this.props;

        return (
            <div className="notes-list">
                <NoteDragPreview key="__preview" notes={notes} />
                {notes.map((note, index) => (
                    <Note
                        note={note}
                        key={note.id}
                        index={index}
                        onMoveNote={onMoveNote}
                        onDropNote={onDropNote}
                    />
                ))}
            </div>
        );
    }
}
