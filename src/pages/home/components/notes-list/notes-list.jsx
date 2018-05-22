// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';
import {
    notesActionsPropType,
    notesListPropType
} from '@common/prop-types/notes.prop-types';
import { notesActions, notesSelectors } from '@common/features/notes';
import Note from '../note';
import './notes-list.scss';

const mapStateToProps = state => ({
    notes: notesSelectors.getNotes(state)
});

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class NotesList extends Component {
    static propTypes = {
        notes: notesListPropType.isRequired,
        notesActions: notesActionsPropType.isRequired
    };

    onDropNote = (oldIndex, newIndex) => {
        this.changeNoteOrder({
            oldIndex,
            newIndex,
            commitChanges: true
        });
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

        this.onDropNote(source.index, destination.index);
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
                                <Draggable
                                    draggableId={note.id}
                                    index={index}
                                    key={note.id}
                                >
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
