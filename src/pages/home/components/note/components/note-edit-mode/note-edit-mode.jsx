import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '~/common/features/form';
import { notePropType } from '~/common/prop-types/notes.prop-types';
import MultilineInput from '~/common/components/multiline-input';

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
                className="note"
                onSubmit={this.onSave}
                validate={this.validate}
                initialValues={note}
                render={({ invalid }) => (
                    <Fragment>
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
                            <Field
                                name="title"
                                component="input"
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
                    </Fragment>
                )}
            />
        );
    }
}
