import React from 'react';
import PropTypes from 'prop-types';
import { toClass } from 'recompose';
import FilesListItem from './components/files-list-item';

const FilesList = ({ files }) => {
    if (files.length === 0) {
        return null;
    }

    return (
        <ul className="files-list list-unstyled">
            {files.map(file => (
                <FilesListItem
                    key={file.id}
                    file={file}
                    onRemove={file.remove}
                />
            ))}
        </ul>
    );
};

FilesList.propTypes = {
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            remove: PropTypes.func
        }).isRequired
    ).isRequired
};

export default toClass(FilesList);
