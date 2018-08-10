import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, withHandlers } from 'recompose';
import classNames from 'classnames';
import _ from 'lodash';
import { notePropType } from '@common/prop-types/notes.prop-types';
import { modalProvider } from '@common/features/modal';
import FilesList from '../../../file-list';

const linkRegexp = /(http[^\s]+)/g;

const enhance = compose(
    pure,
    withHandlers({
        isLoading: ({ note }) => () => _.get(note, 'meta.transactionId', false),
        wrapUrlLinks: () => text =>
            _.escape(text).replace(
                linkRegexp,
                '<a href="$1" class="note-link" target="_blank" rel="nofollow noopener">$1</a>'
            )
    }),
    withHandlers({
        handleEdit: ({ isLoading, onEdit }) => () => {
            if (isLoading()) {
                return;
            }

            onEdit();
        },
        handleRemove: ({ note, isLoading, onRemove }) => async () => {
            if (isLoading()) {
                return;
            }

            const { id, title } = note;
            const shouldDelete = await modalProvider.showConfirm({
                title: 'Please confirm your action',
                body: `Are you sure you want to delete note "${title}"?`
            }).result;

            if (!shouldDelete) {
                return;
            }

            onRemove(id);
        }
    })
);

const NoteReadonlyMode = ({
    note,
    isLoading,
    wrapUrlLinks,
    handleEdit,
    handleRemove
}) => (
    <div className={classNames('note', { isLoading: isLoading() })}>
        <div>
            <i
                className="icon icon-left icon-pencil"
                onClick={handleEdit}
                onKeyPress={handleEdit}
                role="button"
                tabIndex="0"
            />
            <i
                className="icon icon-right icon-bin"
                onClick={handleRemove}
                onKeyPress={handleRemove}
                role="button"
                tabIndex="0"
            />
        </div>
        <div className="note-title">{note.title}</div>
        <div
            className="note-description"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: wrapUrlLinks(note.description)
            }}
        />
        <FilesList files={note.files} />
    </div>
);

NoteReadonlyMode.propTypes = {
    note: notePropType.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onRemove: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onEdit: PropTypes.func.isRequired,
    isLoading: PropTypes.func.isRequired,
    wrapUrlLinks: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired
};

export default enhance(NoteReadonlyMode);
