import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form';
import { notePropType } from '@common/prop-types/notes.prop-types';
import MultilineInput from '@common/components/multiline-input';
import FieldError from '../../../field-error';
// import Button from '@common/components/button';
// import FilesList from '../../../file-list';

@pure
export default class NoteEditMode extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    onSave = ({ title, description }) => {
        this.props.onSave({
            id: this.props.note.id,
            title,
            description
        });
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
            errors.description = 'Please enter description';
        }

        return errors;
    };

    render() {
        const { note } = this.props;

        return (
            <Form
                onSubmit={this.onSave}
                validate={this.validate}
                initialValues={note}
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
                        <div className="note-title is-editing">
                            <div className="control-field">
                                <Field
                                    name="title"
                                    component="input"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Note title..."
                                />
                                <FieldError name="title" />
                            </div>
                        </div>
                        <div className="note-description is-editing">
                            <div className="control-field">
                                <Field
                                    name="description"
                                    component={MultilineInput}
                                    className="note-description-control"
                                    autoComplete="off"
                                    placeholder="Note description..."
                                />
                                <FieldError name="description" />
                            </div>
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
