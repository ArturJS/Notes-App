import { h, Component } from 'preact';
import { findDOMNode } from 'preact-compat';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import _ from 'lodash';

import firebaseProvider from '../../../../providers/firebase-provider';
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

@pure
@DropTarget(DRAG_TYPE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(DRAG_TYPE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
export default class Note extends Component {
    static propTypes = {
        note: PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            files: PropTypes.array
        }).isRequired,
        onMoveNote: PropTypes.func.isRequired,
        onDropNote: PropTypes.func.isRequired
    };

    state = {
        isEditing: false
    };

    getNoteRef = (id = this.props.note.id) =>
        firebaseProvider.getCurrentUserData().child(`notes_test/${id}`);

    onEdit = () => {
        this.setState({ isEditing: true });
    };

    removeRelatedFiles = () => {
        const { files } = this.props.note;

        if (!files) {
            return Promise.resolve();
        }

        const removeFilesPromises = files.map(file =>
            firebaseProvider.storage
                .ref()
                .child(file.storagePath)
                .delete()
        );

        return Promise.all(removeFilesPromises);
    };

    connectSiblings = () => {
        const { prev, next } = this.props.note;

        if (prev) {
            this.getNoteRef(prev).update({
                next: next || null
            });
        }

        if (next) {
            this.getNoteRef(next).update({
                prev: prev || null
            });
        }
    };

    onRemove = async () => {
        // TODO: implement optimistic updates with rollback in case of error
        this.connectSiblings();
        this.getNoteRef().remove();
        this.removeRelatedFiles();
    };

    onSave = ({ title, description }) => {
        this.getNoteRef().update({
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

    setTextareaRef = node => {
        if (!node || !node.base) {
            return;
        }
        const descriptionEl = node.base;

        this.descriptionEl = descriptionEl;

        window.requestAnimationFrame(() => {
            descriptionEl.style.height = '0px';
            descriptionEl.style.height = `${descriptionEl.scrollHeight}px`;
        });
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
                        <div className={'note-description'}>
                            <Field
                                name="description"
                                component="textarea"
                                ref={this.setTextareaRef}
                                className={'note-description-control'}
                                autoComplete="off"
                                placeholder="Note description..."
                            />
                        </div>
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
