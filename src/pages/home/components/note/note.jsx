import React, { Component } from 'react';
import { findDOMNode } from 'preact-compat';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form';
import { DragSource, DropTarget } from 'react-dnd';
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
const DRAG_TYPE = 'NOTE';
let dragStartIndex;

const noteSource = {
    beginDrag(props) {
        const { note } = props;
        dragStartIndex = props.index;

        return {
            note
        };
    },
    endDrag(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === dragStartIndex) return;

        props.onDropNote(dragIndex, hoverIndex);
    }
};
const noteTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        // eslint-disable-next-line react/no-find-dom-node
        const hoverBoundingRect = findDOMNode(
            component
        ).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the left
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Dragging right
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging left
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.onMoveNote(dragIndex, hoverIndex);

        // Task: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        // eslint-disable-next-line no-param-reassign
        monitor.getItem().index = hoverIndex;
    }
};
const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
@DropTarget(DRAG_TYPE, noteTarget, dndConnect => ({
    connectDropTarget: dndConnect.dropTarget()
}))
@DragSource(DRAG_TYPE, noteSource, (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging()
}))
export default class Note extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        // eslint-disable-next-line react/no-unused-prop-types
        onMoveNote: PropTypes.func.isRequired,
        // eslint-disable-next-line react/no-unused-prop-types
        onDropNote: PropTypes.func.isRequired,
        notesActions: notesActionsPropType.isRequired
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
            connectDropTarget,
            connectDragPreview,
            connectDragSource,
            isDragging
        } = this.props;

        return connectDropTarget(
            connectDragPreview(
                <div className={classNames('note', { isDragging })}>
                    <div>
                        <i
                            className={'icon icon-left icon-pencil'}
                            onClick={this.onEdit}
                        />
                        <i
                            className={'icon icon-right icon-bin'}
                            onClick={this.onRemove}
                        />
                    </div>
                    {connectDragSource(
                        <div className={'note-title'}>{note.title}</div>
                    )}
                    <div
                        className={'note-description'}
                        dangerouslySetInnerHTML={{
                            __html: this.wrapUrlLinks(note.description)
                        }}
                    />
                    <FilesList files={note.files} />
                </div>
            )
        );
    }

    renderEditMode() {
        const { note } = this.props;

        return (
            <Form
                onSubmit={this.onSave}
                validate={this.validate}
                initialValues={note}
                render={({ handleSubmit, invalid }) => (
                    <form className={'note'} onSubmit={handleSubmit} noValidate>
                        <div>
                            <button
                                type="submit"
                                className={' icon-submit'}
                                disabled={invalid}>
                                <i className={'icon icon-checkmark'} />
                            </button>
                            <i
                                className={'icon icon-right icon-cross'}
                                onClick={this.onCancel}
                            />
                        </div>
                        <div className={'note-title'}>
                            <Field
                                name="title"
                                component="input"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Note title..."
                            />
                        </div>
                        <div className={'note-description is-editing'}>
                            <Field
                                name="description"
                                component={MultilineInput}
                                className={'note-description-control'}
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
