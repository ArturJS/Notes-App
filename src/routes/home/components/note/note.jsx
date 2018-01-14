import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import _ from 'lodash';

import firebaseProvider from '../../../../providers/firebase-provider';
import './note.scss';

const linkRegexp = /(http[^\s]+)/g;

export default class Note extends Component {
    static propTypes = {
        note: PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired
        }).isRequired
    };

    state = {
        isEditing: false
    };

    getNoteRef = () => {
        const { id } = this.props.note;

        return firebaseProvider.getCurrentUserData().child(`notes/${id}`);
    };

    onEdit = () => {
        this.setState({ isEditing: true });
    };

    onRemove = () => {
        this.getNoteRef().remove();
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
        const { note } = this.props;

        return (
            <div className={'note'}>
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
                <div className={'note-title'}>{note.title}</div>
                <div
                    className={'note-description'}
                    dangerouslySetInnerHTML={{
                        __html: this.wrapUrlLinks(note.description)
                    }}
                />
            </div>
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
