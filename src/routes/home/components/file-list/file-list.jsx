import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import firebaseProvider from '../../../../common/providers/firebase-provider';
import './file-list.scss';

export default class FilesList extends Component {
    static propTypes = {
        files: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired
        ).isRequired,
        onRemove: PropTypes.func
    };

    render() {
        const { files, onRemove } = this.props;

        if (!files) {
            return null;
        }

        return (
            <ul className={'files-list list-unstyled'}>
                {files.map(file => (
                    <FilesList.Item file={file} onRemove={onRemove} />
                ))}
            </ul>
        );
    }
}

FilesList.Item = class extends Component {
    downloadFile = async () => {
        const { file } = this.props;

        if (!file.storagePath) {
            return;
        }

        const downloadUrl = await firebaseProvider.storage
            .ref()
            .child(file.storagePath)
            .getDownloadURL();

        this.openUrlInNewTab(downloadUrl);
    };

    openUrlInNewTab(url) {
        window.open(url, '_blank').focus();
    }

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
        const hasDownloadLink = !!this.props.file.storagePath;

        return (
            <div
                className={classNames('files-list__item-name', {
                    cp: hasDownloadLink
                })}
                onClick={this.downloadFile}>
                <span className="files-list__item-name-start">
                    {fileNameStart}
                </span>
                <span className="files-list__item-name-end">{fileNameEnd}</span>
            </div>
        );
    }

    render() {
        const { onRemove, file } = this.props;

        return (
            <li className={'files-list__item'}>
                {this.renderFileName(file.name)}
                &nbsp;
                {onRemove && (
                    <i
                        className={'files-list__item-remove icon-cross'}
                        tabIndex="1"
                        onClick={() => onRemove(file)}
                    />
                )}
            </li>
        );
    }
};
