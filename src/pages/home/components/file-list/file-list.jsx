import React from 'react';
import PropTypes from 'prop-types';
import { toClass } from 'recompose';
import FilesListItem from './components/files-list-item';
import './file-list.scss';

const FilesList = ({ files, onRemove }) => {
    if (!files) {
        return null;
    }

    return (
        <ul className="files-list list-unstyled">
            {files.map(file => (
                <FilesListItem file={file} onRemove={onRemove} />
            ))}
        </ul>
    );
};

FilesList.propTypes = {
    files: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    onRemove: PropTypes.func
};

FilesList.defaultProps = {
    onRemove: null
};

export default toClass(FilesList);
