import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

const fileEssentialPropTypes = {
    name: PropTypes.string.isRequired,
    downloadPath: PropTypes.string.isRequired
};

export default class FilesListItem extends Component {
    static propTypes = {
        file: PropTypes.oneOfType([
            PropTypes.shape(fileEssentialPropTypes).isRequired,
            PropTypes.shape({
                ...fileEssentialPropTypes,
                isUploaded: PropTypes.func.isRequired,
                subscribe: PropTypes.func.isRequired
            }).isRequired
        ]).isRequired,
        onRemove: PropTypes.func
    };

    static defaultProps = {
        onRemove: null
    };

    state = {
        isUploaded: false,
        isRemoved: false
    };

    componentDidMount() {
        const { file } = this.props;

        this.unsubscribe = _.noop;

        if (file.subscribe) {
            this.unsubscribe = file.subscribe('change', this.subscribeOnChange);
        }
    }

    subscribeOnChange = (key, value) => {
        const isUploaded = key === 'uploadProgress' && value === 100;

        if (isUploaded) {
            this.setState({
                isUploaded: true
            });
        } else if (key === 'isRemoved') {
            this.setState({
                isRemoved: value
            });
        }
    };

    isUploaded = () => {
        const { file } = this.props;

        return !file.isUploaded || file.isUploaded() || this.state.isUploaded;
    };

    handleRemove = () => {
        this.props.onRemove();
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
        const { isRemoved } = this.state;

        if (isRemoved) {
            return null;
        }

        return (
            <li
                className={classNames('files-list__item', {
                    '--done': this.isUploaded()
                })}
            >
                {this.renderFileName(file.name)}
                &nbsp;
                {onRemove && (
                    <i
                        className="files-list__item-remove icon-cross"
                        onClick={this.handleRemove}
                        onKeyPress={this.handleRemove}
                        role="button"
                        tabIndex="0"
                    />
                )}
            </li>
        );
    }
}
