import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import Button from '../../../../common/components/button';
import {
    notesActionsPropType,
    notePropType
} from '../../../../../../common/prop-types/notes.prop-types';
import MultilineInput from '../../../../../../common/components/multiline-input';
import { notesActions } from '../../../../../../common/features/notes';
// import FilesList from '../../../file-list';

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
export default class NoteEditMode extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        notesActions: notesActionsPropType.isRequired,
        isDragging: PropTypes.bool.isRequired,
        provided: PropTypes.shape({
            innerRef: PropTypes.func.isRequired,
            draggableProps: PropTypes.object.isRequired,
            dragHandleProps: PropTypes.object.isRequired
        }).isRequired,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    onSave = ({ title, description }) => {
        this.props.notesActions.updateNoteRequest({
            id: this.props.note.id,
            title,
            description
        });
        this.props.onSave();
    };

    onCancel = () => {
        this.props.onCancel();
    };

    validate = ({ title, description }) => {
        const errors = {};

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.title = 'Please enter description';
        }

        return errors;
    };

    render() {
        const { note, provided } = this.props;

        return (
            <Form
                onSubmit={this.onSave}
                validate={this.validate}
                initialValues={note}
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                render={({ handleSubmit, invalid }) => (
                    <form className="note" onSubmit={handleSubmit} noValidate>
                        <div>
                            <button
                                type="submit"
                                className="icon-submit"
                                disabled={invalid}
                            >
                                <i className="icon icon-checkmark" />
                            </button>
                            <i
                                className="icon icon-right icon-cross"
                                onClick={this.onCancel}
                                onKeyPress={this.onCancel}
                                role="button"
                                tabIndex="0"
                            />
                        </div>
                        <div className="note-title">
                            <Field
                                name="title"
                                component="input"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Note title..."
                            />
                        </div>
                        <div className="note-description is-editing">
                            <Field
                                name="description"
                                component={MultilineInput}
                                className="note-description-control"
                                autoComplete="off"
                                placeholder="Note description..."
                            />
                        </div>
                        {/* <FilesList
                            files={note.files}
                            onRemove={this.onRemoveFile}
                        /> */}
                        {/*
                        <div className={'buttons-group'}>
                            <Button
                                type="button"
                                className={'btn-file'}
                                theme="hot">
                                <input
                                    type="file"
                                    multiple
                                    onChange={this.attachFiles}
                                />
                                Attach files
                            </Button>
                        </div>
                        */}
                    </form>
                )}
            />
        );
    }
}
