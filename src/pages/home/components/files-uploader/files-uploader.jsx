import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, withHandlers, lifecycle } from 'recompose';
import withRefs from '~/common/hocs/with-refs';
import { modalProvider } from '~/common/features/modal';
import Button from '~/common/components/button';
import { createStore } from './helpers/store';
import { createFileInstance } from './helpers/file-instance';

const withStore = initialState =>
    withHandlers(() => {
        const store = createStore(initialState);

        return {
            getStore: () => () => store
        };
    });

const enhance = compose(
    pure,
    withRefs,
    withStore({
        files: [],
        isUploading: false
    }),
    withHandlers({
        updateUploadingState: ({ getStore, onUploadStateChanged }) => () => {
            const waitForUploading = async () => {
                let uploadDone = false;

                do {
                    const { files } = getStore().getState();
                    const uploadPromises = files.map(
                        file => file.uploadingPromise
                    );

                    // eslint-disable-next-line no-await-in-loop
                    await Promise.all(uploadPromises);

                    uploadDone = getStore()
                        .getState()
                        .files.every(file => file.isUploaded());
                } while (!uploadDone);
            };

            onUploadStateChanged({
                isUploading: true
            });

            const stopUploading = () => {
                onUploadStateChanged({
                    isUploading: false
                });
            };

            waitForUploading()
                .then(stopUploading)
                .catch(stopUploading);
        }
    }),
    withHandlers({
        produceFileInstances: ({
            getStore,
            updateUploadingState
        }) => filesFromInput => {
            const store = getStore();
            const subscribeOnRemove = (fileInstances, handleRemove) => {
                fileInstances.forEach(fileInstance => {
                    fileInstance.subscribe('remove', handleRemove);
                });
            };
            const fileInstances = filesFromInput.map(createFileInstance);

            subscribeOnRemove(fileInstances, fileId => {
                store.setState(prevState => ({
                    files: prevState.files.filter(file => file.id !== fileId)
                }));
            });
            updateUploadingState();

            return fileInstances;
        }
    }),
    withHandlers({
        attachFiles: ({ getStore, produceFileInstances }) => filesFromInput => {
            const store = getStore();
            const fileInstances = produceFileInstances(filesFromInput);

            store.setState(prevState => ({
                files: [...prevState.files, ...fileInstances]
            }));
        },
        validateTotalFilesSize: ({ getStore }) => newFiles => {
            const store = getStore();
            const existingFiles = store.getState().files;
            const TEN_MEGABYTES = 10 * 1024 * 1024;
            const allFiles = [...newFiles, ...existingFiles];
            const allFileSizes = allFiles.map(({ size }) => size);
            const totalFilesSize = allFileSizes.reduce(
                (acc, value) => acc + value,
                0
            );

            return totalFilesSize <= TEN_MEGABYTES;
        },
        resetFileInput: ({ getRef }) => () => {
            const fileInput = getRef('fileInput');

            if (!fileInput) {
                return;
            }

            fileInput.value = '';

            if (!/safari/i.test(window.navigator.userAgent)) {
                fileInput.type = '';
                fileInput.type = 'file';
            }
        }
    }),
    withHandlers({
        handleChange: ({
            attachFiles,
            resetFileInput,
            validateTotalFilesSize
        }) => e => {
            const files = Array.from(e.target.files);
            const isInvalid = !validateTotalFilesSize(files);

            if (isInvalid) {
                modalProvider.showError({
                    title: 'Error!',
                    body: 'Total allowed files size is 10 megabytes.'
                });

                return;
            }

            attachFiles(files);
            resetFileInput();
        }
    }),
    lifecycle({
        componentDidMount() {
            const store = this.props.getStore();

            this.props.provideStore(store);
        },
        componentWillUnmount() {
            this.props.provideStore(null);
        }
    })
);

const FilesUploader = ({ setRef, handleChange }) => (
    <Button type="button" className="btn-file" theme="hot">
        <input
            type="file"
            multiple
            ref={ref => setRef('fileInput', ref)}
            onChange={handleChange}
        />
        Attach files
    </Button>
);

FilesUploader.propTypes = {
    handleChange: PropTypes.func.isRequired,
    setRef: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    provideStore: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onUploadStateChanged: PropTypes.func.isRequired
};

export default enhance(FilesUploader);
