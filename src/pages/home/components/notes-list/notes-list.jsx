// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { notesListPropType } from '../../../../common/prop-types/notes.prop-types';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import Note from '../note';
import './notes-list.scss';

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default class NotesList extends Component {
    static propTypes = {
        // notes: notesListPropType.isRequired,
        // onMoveNote: PropTypes.func.isRequired,
        // onDropNote: PropTypes.func.isRequired
    };

    state = {
        notes: [
            {
                id: 6,
                title: 'qew',
                description: 'qwe',
                files: []
            },
            {
                id: 1,
                title: 'first',
                description:
                    'first\n\n\nhttps://github.com/danneu/koa-bouncer/tree/next',
                files: []
            },
            {
                id: 2,
                title: 'second',
                description: 'second one\n\nddddd\n2134',
                files: []
            }
        ]
    };

    onDragStart = () => {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }
    };

    onDragEnd = ({ source, destination }) => {
        if (!destination) {
            // dropped outside the list
            return;
        }

        if (destination.index === source.index) {
            return;
        }

        const notes = reorder(
            this.state.notes,
            source.index,
            destination.index
        );

        this.setState({
            notes
        });
    };

    render() {
        // const { notes, onMoveNote, onDropNote } = this.props;
        const { notes } = this.state;

        return (
            <div className="notes-list">
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <Droppable droppableId="notes-list" type="notes-list">
                        {dropProvided => (
                            <div
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                            >
                                {notes.map((note, index) => (
                                    <Draggable
                                        key={note.id}
                                        draggableId={note.id}
                                        index={index}
                                    >
                                        {(dragProvided, dragSnapshot) => (
                                            <Note
                                                note={note}
                                                key={note.id}
                                                index={index}
                                                isDragging={
                                                    dragSnapshot.isDragging
                                                }
                                                provided={dragProvided}
                                            />
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}
