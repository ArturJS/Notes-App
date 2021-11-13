import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';
import {
    notesActionsPropType,
    notesListPropType
} from '~/common/prop-types/notes.prop-types';
import { notesActions, notesSelectors } from '~/common/features/notes';
import AnimateHeight from '~/common/components/animate-height';
import Note from '../note';

const mapStateToProps = state => ({
    notes: notesSelectors.getNotes(state)
});

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});


class NotesList extends Component {
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

    isDragDisabled = note => _.get(note, 'meta.transactionId', false);

    renderDraggableItem = (note, index) => (
        <Draggable
            draggableId={note.trackId}
            isDragDisabled={this.isDragDisabled(note)}
            index={index}
            key={note.trackId}
        >
            {(dragProvided, dragSnapshot) => (
                <Note
                    note={note}
                    key={note.trackId}
                    index={index}
                    isDragging={dragSnapshot.isDragging}
                    provided={dragProvided}
                />
            )}
        </Draggable>
    );

    renderAnimatedItem = (note, index) => (
        <AnimateHeight key={note.trackId}>
            {this.renderDraggableItem(note, index)}
        </AnimateHeight>
    );

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
                            <TransitionGroup>
                                {notes.map((note, index) =>
                                    this.renderAnimatedItem(note, index)
                                )}
                            </TransitionGroup>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesList);
