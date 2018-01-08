import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Field } from 'react-final-form';

import pencilIcon from './icons/pencil-icon.svg';
import trashIcon from './icons/trash-icon.svg';
import checkIcon from './icons/check-icon.svg';
import timesIcon from './icons/times-icon.svg';
import style from './note.scss';

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

    onEdit = () => {
        this.setState({ isEditing: true });
    };

    onRemove = () => {};

    onSave = () => {
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

    renderDefaultMode() {
        const { note } = this.props;

        return (
            <div className={style.note}>
                <div>
                    <img
                        className={classNames(style.icon, style.iconLeft)}
                        src={pencilIcon}
                        data-non-draggable
                        onClick={this.onEdit}
                    />
                    <img
                        className={classNames(style.icon, style.iconRight)}
                        src={trashIcon}
                        data-non-draggable
                        onClick={this.onRemove}
                    />
                </div>
                <div className={style.noteTitle}>{note.title}</div>
                <div className={style.noteDescription} data-non-draggable>
                    {note.description}
                </div>
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
                    <form
                        className={style.note}
                        onSubmit={handleSubmit}
                        data-non-draggable
                        noValidate>
                        <div>
                            <button
                                type="submit"
                                className={style.iconSubmit}
                                disabled={invalid}>
                                <img
                                    className={classNames(
                                        style.icon,
                                        style.iconLeft
                                    )}
                                    src={checkIcon}
                                />
                            </button>
                            <img
                                className={classNames(
                                    style.icon,
                                    style.iconRight
                                )}
                                src={timesIcon}
                                onClick={this.onCancel}
                            />
                        </div>
                        <div className={style.noteTitle}>
                            <Field
                                name="title"
                                component="input"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Note title..."
                            />
                        </div>
                        <div className={style.noteDescription}>
                            <Field
                                name="description"
                                component="textarea"
                                className={style.noteDescriptionControl}
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
