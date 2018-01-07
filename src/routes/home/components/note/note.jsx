import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

    renderEditIcons() {
        return (
            <div>
                <img
                    className={classNames(style.icon, style.iconLeft)}
                    src={checkIcon}
                    data-non-draggable
                    onClick={this.onSave}
                />
                <img
                    className={classNames(style.icon, style.iconRight)}
                    src={timesIcon}
                    data-non-draggable
                    onClick={this.onCancel}
                />
            </div>
        );
    }

    renderDefaultIcons() {
        return (
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
        );
    }

    render() {
        const { note } = this.props;
        const { isEditing } = this.state;

        return (
            <div className={style.note}>
                {isEditing ? this.renderEditIcons() : this.renderDefaultIcons()}
                <div className={style.noteTitle}>{note.title}</div>
                <div className={style.noteDescription} data-non-draggable>
                    {note.description}
                </div>
            </div>
        );
    }
}
