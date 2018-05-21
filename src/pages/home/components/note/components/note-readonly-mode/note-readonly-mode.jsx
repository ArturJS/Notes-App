import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import classNames from 'classnames';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    notesActionsPropType,
    notePropType
} from '../../../../../../common/prop-types/notes.prop-types';
import { notesActions } from '../../../../../../common/features/notes';
import FilesList from '../../../file-list';

const linkRegexp = /(http[^\s]+)/g;

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
export default class NoteReadonlyMode extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        notesActions: notesActionsPropType.isRequired,
        isDragging: PropTypes.bool.isRequired,
        provided: PropTypes.shape({
            innerRef: PropTypes.func.isRequired,
            draggableProps: PropTypes.object.isRequired,
            dragHandleProps: PropTypes.object.isRequired
        }).isRequired,
        onEdit: PropTypes.func.isRequired
    };

    onEdit = () => {
        this.props.onEdit();
    };

    onRemove = async () => {
        const { id } = this.props.note;

        this.props.notesActions.deleteNoteRequest(id);
    };

    wrapUrlLinks = text =>
        _.escape(text).replace(
            linkRegexp,
            '<a href="$1" class="note-link" target="_blank" rel="nofollow noopener">$1</a>'
        );

    render() {
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
}
