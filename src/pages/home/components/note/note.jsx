import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import Button from '../../../../common/components/button';

import {
    notesActionsPropType,
    notePropType
} from '../../../../common/prop-types/notes.prop-types';
import MultilineInput from '../../../../common/components/multiline-input';
import { notesActions } from '../../../../common/features/notes';
import FilesList from '../file-list';
import './note.scss';

const linkRegexp = /(http[^\s]+)/g;

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
export default class Note extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        notesActions: notesActionsPropType.isRequired,
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

    onRemove = async () => {
        const { id } = this.props.note;

        this.props.notesActions.deleteNoteRequest(id);
    };

    onSave = ({ title, description }) => {
        this.props.notesActions.updateNoteRequest({
            id: this.props.note.id,
            title,
            description
        });
        this.setState({ isEditing: false });
    };

    onCancel = () => {
        this.setState({ isEditing: false });
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

    wrapUrlLinks = text =>
        _.escape(text).replace(
            linkRegexp,
            '<a href="$1" class="note-link" target="_blank" rel="nofollow noopener">$1</a>'
        );

    renderDefaultMode() {
        const {
            note,
            // isDragging,
            provided
        } = this.props;

        const isDragging = false;

        return (
            <div
                className={classNames('note', { isDragging })}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <div>
                    <i
                        className="icon icon-left icon-pencil"
                        onClick={this.onEdit}
                        onKeyPress={this.onEdit}
                        role="button"
                        tabIndex="0"
                    />
                    <i
                        className="icon icon-right icon-bin"
                        onClick={this.onRemove}
                        onKeyPress={this.onRemove}
                        role="button"
                        tabIndex="0"
                    />
                </div>
                <div className="note-title">{note.title}</div>
                <div
                    className="note-description"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: this.wrapUrlLinks(note.description)
                    }}
                />
                <FilesList files={note.files} />
            </div>
        );
    }

    renderEditMode() {
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

    render() {
        const { isEditing } = this.state;

        return isEditing ? this.renderEditMode() : this.renderDefaultMode();
    }
}
