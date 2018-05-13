// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { notesListPropType } from '../../../../common/prop-types/notes.prop-types';
import Note from '../note';
import './notes-list.scss';

export default class NotesList extends Component {
    static propTypes = {
        notes: notesListPropType.isRequired,
        onDropNote: PropTypes.func.isRequired
    };

    onDragStart = () => {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }
    };

    onDragEnd = ({ source, destination }) => {
        const isDroppedOutsideList = !destination;
        const isNotChangedOrder = (destination || {}).index === source.index;
        const shouldAvoidUpdate = isDroppedOutsideList || isNotChangedOrder;

        if (shouldAvoidUpdate) {
            return;
        }

        this.props.onDropNote(source.index, destination.index);
    };

    render() {
        const { notes } = this.props;

        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                <Droppable
                    droppableId="notes-list-droppableId"
                    type="notes-list-type"
                >
                    {dropProvided => (
                        <div
                            className="notes-list"
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                        >
                            {notes.map((note, index) => (
                                <Draggable draggableId={note.id} index={index}>
                                    {(dragProvided, dragSnapshot) => (
                                        <Note
                                            note={note}
                                            key={note.id}
                                            index={index}
                                            isDragging={dragSnapshot.isDragging}
                                            provided={dragProvided}
                                        />
                                    )}
                                </Draggable>
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}
