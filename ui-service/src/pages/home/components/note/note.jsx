import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { notePropType } from '@common/prop-types/notes.prop-types';
import NoteEditMode from './components/note-edit-mode';
import NoteReadonlyMode from './components/note-readonly-mode';
import './note.scss';

@pure
export default class Note extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        isDragging: PropTypes.bool.isRequired,
        provided: PropTypes.shape({
            innerRef: PropTypes.func.isRequired,
            draggableProps: PropTypes.object.isRequired,
            dragHandleProps: PropTypes.object.isRequired
        }).isRequired
    };

    state = {
        isEditing: false
    };

    onEdit = () => {
        this.setState({ isEditing: true });
    };

    onSave = () => {
        this.setState({ isEditing: false });
    };

    onCancel = () => {
        this.setState({ isEditing: false });
    };

    render() {
        const { note, isDragging, provided } = this.props;
        const { isEditing } = this.state;

        return isEditing ? (
            <NoteEditMode
                note={note}
                isDragging={isDragging}
                provided={provided}
                onSave={this.onSave}
                onCancel={this.onCancel}
            />
        ) : (
            <NoteReadonlyMode
                note={note}
                isDragging={isDragging}
                provided={provided}
                onEdit={this.onEdit}
            />
        );
    }
}
