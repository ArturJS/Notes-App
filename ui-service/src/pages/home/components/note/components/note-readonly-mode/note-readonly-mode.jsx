import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import classNames from 'classnames';
import _ from 'lodash';
import { notePropType } from '@common/prop-types/notes.prop-types';
import { modalProvider } from '@common/features/modal';
import FilesList from '../../../file-list';

const linkRegexp = /(http[^\s]+)/g;

@pure
export default class NoteReadonlyMode extends Component {
    static propTypes = {
        note: notePropType.isRequired,
        onRemove: PropTypes.func.isRequired,
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

        this.props.onRemove(id);
    };

    isLoading = () => _.get(this.props.note, 'meta.transactionId', false);

    wrapUrlLinks = text =>
        _.escape(text).replace(
            linkRegexp,
            '<a href="$1" class="note-link" target="_blank" rel="nofollow noopener">$1</a>'
        );

    render() {
        const { note } = this.props;
        const isLoading = this.isLoading();

        return (
            <div className={classNames('note', { isLoading })}>
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
