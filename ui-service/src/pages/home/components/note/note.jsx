import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    notesActionsPropType,
    notePropType
} from '@common/prop-types/notes.prop-types';
import { notesActions } from '@common/features/notes';
import NoteEditMode from './components/note-edit-mode';
import NoteReadonlyMode from './components/note-readonly-mode';
import './note.scss';

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
export default class Note extends Component {
    static propTypes = {
        notesActions: notesActionsPropType.isRequired,
        note: notePropType.isRequired,
        provided: PropTypes.shape({
            innerRef: PropTypes.func.isRequired,
            draggableProps: PropTypes.object.isRequired,
            dragHandleProps: PropTypes.object
        }).isRequired
    };

    state = {
        isEditing: false
    };

    onEdit = () => {
        this.toggleIsEditing(true);
    };

    onRemove = id => {
        this.props.notesActions.deleteNoteRequest(id);
    };

    onSave = note => {
        this.toggleIsEditing(false);
        this.props.notesActions.updateNoteRequest(note);
    };

    onCancel = () => {
        this.toggleIsEditing(false);
    };

    toggleIsEditing = value => {
        this.setState({ isEditing: value });
    };

    render() {
        const { note, provided } = this.props;
        const { isEditing } = this.state;

        return (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                {isEditing ? (
                    <NoteEditMode
                        note={note}
                        onSave={this.onSave}
                        onCancel={this.onCancel}
                    />
                ) : (
                    <NoteReadonlyMode
                        note={note}
                        onEdit={this.onEdit}
                        onRemove={this.onRemove}
                    />
                )}
            </div>
        );
    }
}
