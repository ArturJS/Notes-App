import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class FilesListItem extends Component {
    static propTypes = {
        file: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        onRemove: PropTypes.func
    };

    static defaultProps = {
        onRemove: null
    };

    splitFileName({ fileName, splitPosition }) {
        return [
            fileName.slice(0, splitPosition),
            fileName.substr(splitPosition)
        ];
    }

    renderFileName(fileName = '') {
        // necessary to render ellipsis in the middle of the filename
        const ENDING_LENGTH = 7;

        if (fileName.length <= ENDING_LENGTH) {
            return <div className="files-list__item-name">{fileName}</div>;
        }

        const [fileNameStart, fileNameEnd] = this.splitFileName({
            fileName,
            splitPosition: fileName.length - ENDING_LENGTH
        });
        const { file } = this.props;
        const hasDownloadLink = !!file.downloadPath;

        return (
            <a
                className={classNames('files-list__item-name', {
                    '--done': hasDownloadLink
                })}
                title={fileName}
                href={file.downloadPath}
                target="_blank"
            >
                <span className="files-list__item-name-start">
                    {fileNameStart}
                </span>
                <span className="files-list__item-name-end">{fileNameEnd}</span>
            </a>
        );
    }

    render() {
        const { onRemove, file } = this.props;
        const hasDownloadLink = !!file.downloadPath;

        return (
            <li
                className={classNames('files-list__item', {
                    '--done': hasDownloadLink
                })}
            >
                {this.renderFileName(file.name)}
                &nbsp;
                {onRemove && (
                    <i
                        className="files-list__item-remove icon-cross"
                        onClick={() => onRemove(file)}
                        onKeyPress={() => onRemove(file)}
                        role="button"
                        tabIndex="0"
                    />
                )}
            </li>
        );
    }
}
