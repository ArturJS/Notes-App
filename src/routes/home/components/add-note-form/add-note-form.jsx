// @flow
// @jsx h
import type { FormApi } from 'final-form';

import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import _ from 'lodash';

import firebaseProvider from '../../../../providers/firebase-provider';
import Button from '../../../../components/button';
import MultilineInput from '../../../../components/multiline-input';
import FilesList from '../file-list';
import './add-note-form.scss';

const FILE_UPLOAD_STATE = {
    pending: '[PENDING]',
    fulfilled: '[FULFILLED]',
    rejected: '[REJECTED]'
};

type UploadFileResult = {
    remove: () => void,
    uploadPromise: Promise<void>,
    storagePath: string
};

type FileToUpload = {
    file: File,
    ...UploadFileResult
};

type Note = {
    title: string,
    description: string
};

type Props = {};

type State = {
    filesToUpload: FileToUpload[]
};

export default class AddNoteForm extends Component<Props, State> {
    static propTypes = {
        notes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                files: PropTypes.array,
                prev: PropTypes.string,
                next: PropTypes.string
            }).isRequired
        ).isRequired
    };

    state: State = {
        filesToUpload: []
    };

    waitForUploading = async (): Promise<void[]> => {
        const uploadPromises = this.state.filesToUpload.map(
            ({ uploadPromise }) => uploadPromise
        );

        return Promise.all(uploadPromises);
    };

    getNotesRef = () => firebaseProvider.getCurrentUserData().child('notes');

    getLastNote = () => {
        const { notes } = this.props;

        if (notes.length === 0) {
            return null;
        }

        return _.find(notes, note => !note.next);
    };

    updatePrevNoteRef(newNoteId) {
        const lastNote = this.getLastNote();

        if (!lastNote) {
            return;
        }

        this.getNotesRef()
            .child(lastNote.id)
            .update({
                next: newNoteId
            });
    }

    createNote = async ({ title, description }: Note): Promise<void> => {
        const notesRef = this.getNotesRef();
        const newNoteId = notesRef.push().key;

        await this.waitForUploading();

        const lastNote = this.getLastNote();
        let prevNoteId = null;

        if (lastNote) {
            prevNoteId = lastNote.id;
        }

        notesRef.child(newNoteId).update({
            title,
            description,
            files: this.state.filesToUpload.map(({ file, storagePath }) => ({
                name: (file: any).name,
                storagePath
            })),
            prev: prevNoteId
        });
        this.updatePrevNoteRef(newNoteId);
    };

    onSubmit = async (values: Note, formApi: FormApi) => {
        if (!firebaseProvider.isLoggedIn()) {
            return;
        }

        await firebaseProvider.updatesQueue.add(() => this.createNote(values));

        formApi.reset();
        this.setState({ filesToUpload: [] });
    };

    validate = ({ title, description }: Note) => {
        const errors = {};

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.description = 'Please enter description';
        }

        return errors;
    };

    removeFile = (fileToRemove: File): void => {
        this.setState(({ filesToUpload }) => ({
            filesToUpload: filesToUpload.filter(
                ({ file }) => file !== fileToRemove
            )
        }));
    };

    uploadFile = (file: File): UploadFileResult => {
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

    attachFile = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        const additionalFiles = Array.from(e.target.files);
        const additionalFileItems = additionalFiles.map(
            (file: File): FileToUpload => ({
                file,
                ...this.uploadFile(file)
            })
        );

        this.setState(
            ({ filesToUpload }: { filesToUpload: FileToUpload[] }) => ({
                filesToUpload: [...filesToUpload, ...additionalFileItems]
            })
        );
    };

    onRemove = (fileToRemove: File): void => {
        const relatedFileItem = _.find(
            this.state.filesToUpload,
            ({ file }) => file === fileToRemove
        );

        if (!relatedFileItem) {
            return;
        }

        if (typeof relatedFileItem.remove === 'function') {
            relatedFileItem.remove();
        }
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
                                component={MultilineInput}
                                className="form-control"
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
