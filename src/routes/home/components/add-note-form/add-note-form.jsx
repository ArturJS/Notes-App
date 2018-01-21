import { h, Component } from 'preact';
import { Form, Field } from 'react-final-form';
import _ from 'lodash';

import firebaseProvider from '../../../../providers/firebase-provider';
import Button from '../../../../components/button';
import FilesList from '../file-list';
import './add-note-form.scss';

const FILE_UPLOAD_STATE = {
    pending: '[PENDING]',
    fulfilled: '[FULFILLED]',
    rejected: '[REJECTED]'
};

export default class AddNoteForm extends Component {
    state = {
        filesToUpload: []
    };

    waitForUploading = async () => {
        const uploadPromises = this.state.filesToUpload.map(
            ({ uploadPromise }) => uploadPromise
        );

        return Promise.all(uploadPromises);
    };

    createNote = async ({ title, description }) => {
        const notesRef = firebaseProvider.getCurrentUserData().child('notes');
        const newNoteId = notesRef.push().key;

        await this.waitForUploading();

        notesRef.child(newNoteId).update({
            title,
            description,
            files: this.state.filesToUpload.map(({ file, storagePath }) => ({
                name: file.name,
                storagePath
            }))
        });
    };

    onSubmit = async (values, formApi) => {
        if (!firebaseProvider.isLoggedIn()) {
            return;
        }

        await this.createNote(values);

        formApi.reset();
        this.setState({ filesToUpload: [] });
    };

    validate = ({ title, description }) => {
        const errors = {};

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.description = 'Please enter description';
        }

        return errors;
    };

    removeFile = fileToRemove => {
        this.setState(({ filesToUpload }) => ({
            filesToUpload: filesToUpload.filter(
                ({ file }) => file !== fileToRemove
            )
        }));
    };

    uploadFile = file => {
        const userEmail = firebaseProvider.auth.currentUser.email;
        const storagePath = `${userEmail}/${Date.now()}/${file.name}`;
        let resolveUploadPromise;
        const uploadPromise = new Promise(resolve => {
            resolveUploadPromise = resolve;
        });
        const uploadTask = firebaseProvider.storage
            .ref()
            .child(storagePath)
            .put(file);
        let uploadStatus = FILE_UPLOAD_STATE.pending;

        uploadTask
            .then(() => {
                uploadStatus = FILE_UPLOAD_STATE.fulfilled;
                resolveUploadPromise();
            })
            .catch(() => {
                uploadStatus = FILE_UPLOAD_STATE.rejected;
                this.removeFile(file);
                resolveUploadPromise();
            });

        return {
            remove: () => {
                if (uploadStatus === FILE_UPLOAD_STATE.pending) {
                    uploadTask.cancel();
                } else {
                    firebaseProvider.storage
                        .ref()
                        .child(storagePath)
                        .delete()
                        .then(() => {
                            this.removeFile(file);
                        });
                }
            },
            uploadPromise,
            storagePath
        };
    };

    attachFile = e => {
        const additionalFiles = Array.from(e.target.files);
        const additionalFileItems = additionalFiles.map(file => ({
            file,
            ...this.uploadFile(file)
        }));

        this.setState(({ filesToUpload }) => ({
            filesToUpload: [...filesToUpload, ...additionalFileItems]
        }));
    };

    onRemove = fileToRemove => {
        const relatedFileItem = _.find(
            this.state.filesToUpload,
            ({ file }) => file === fileToRemove
        );

        if (!relatedFileItem) {
            return;
        }

        relatedFileItem.remove();
    };

    render() {
        const { filesToUpload } = this.state;
        const filesList = filesToUpload.map(({ file }) => file);

        return (
            <Form
                onSubmit={this.onSubmit}
                validate={this.validate}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form
                        onSubmit={handleSubmit}
                        className={'add-note-form'}
                        noValidate>
                        <div class="control-field">
                            <Field
                                name="title"
                                component="input"
                                class="form-control"
                                autoComplete="off"
                                placeholder="Note title..."
                            />
                        </div>
                        <div class="control-field">
                            <Field
                                name="description"
                                component="input"
                                class="form-control"
                                autoComplete="off"
                                placeholder="Note description..."
                            />
                        </div>
                        <FilesList files={filesList} onRemove={this.onRemove} />
                        <div className={'buttons-group'}>
                            <Button
                                type="submit"
                                theme="primary"
                                disabled={pristine || invalid}>
                                Submit
                            </Button>

                            <Button
                                type="button"
                                className={'btn-file'}
                                theme="hot">
                                <input
                                    type="file"
                                    multiple
                                    onChange={this.attachFile}
                                />
                                Attach files
                            </Button>
                        </div>
                    </form>
                )}
            />
        );
    }
}
