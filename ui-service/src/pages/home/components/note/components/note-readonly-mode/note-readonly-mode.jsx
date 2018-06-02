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
} from '@common/prop-types/notes.prop-types';
import { notesActions } from '@common/features/notes';
import { modalProvider } from '@common/features/modal';
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
        if (this.isLoading()) {
            return;
        }

        this.props.onEdit();
    };

    onRemove = async () => {
        if (this.isLoading()) {
            return;
        }

        const { id, title } = this.props.note;
        const shouldDelete = await modalProvider.showConfirm({
            title: 'Please confirm your action',
            body: ['Are you sure you want to delete ', `note "${title}"?`].join(
                ''
            )
        }).result;

        if (!shouldDelete) {
            return;
        }

        this.props.notesActions.deleteNoteRequest(id);
    };

    isLoading = () => _.get(this.props.note, 'meta.transactionId', false);

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
        const isLoading = this.isLoading();

        return (
            <div
                className={classNames('note', { isDragging, isLoading })}
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
