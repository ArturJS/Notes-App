import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Button from '~/common/components/button';
import { authSelectors } from '~/common/features/auth';
import { Form, Field } from '~/common/features/form';
import { notesActionsPropType } from '~/common/prop-types/notes.prop-types';
import MultilineInput from '~/common/components/multiline-input';
import { notesActions } from '~/common/features/notes';
import FilesUploader, { IStore, FileInstance } from '../files-uploader';
import FilesList from '../file-list';

type Note = {
    title: string,
    description: string
};

type NoteValidate = {
    title?: string,
    description?: string
};

type Props = {
    notesActions: typeof notesActions;
    isLoggedIn: boolean;
};

type State = {
    filesUploaderStore: IStore,
    files: FileInstance[]
};

const mapStateToProps = state => ({
    isLoggedIn: authSelectors.isLoggedIn(state)
});
const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});


class AddNoteForm extends Component<Props, State> {
    uploadingPromise: Promise<void>;
    resolveUploadPromise: () => void;
    unsubscribeFromFilesStore: () => void;

    static propTypes = {
        notesActions: notesActionsPropType.isRequired,
        isLoggedIn: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.uploadingPromise = Promise.resolve();
        this.resolveUploadPromise = _.noop;
        this.unsubscribeFromFilesStore = _.noop;
    }

    state = {
        filesUploaderStore: null,
        files: []
    };

    onSubmit = async (values: Note, formApi) => {
        await this.createNote(values);

        formApi.reset();
    };

    onUploadStateChanged = ({ isUploading }) => {
        if (!isUploading) {
            this.resolveUploadPromise();

            return;
        }

        this.uploadingPromise = new Promise(resolve => {
            this.resolveUploadPromise = resolve;
        });
    };

    setFilesUploaderStore = filesUploaderStore => {
        this.unsubscribeFromFilesStore();
        this.setState({
            filesUploaderStore
        });

        if (!filesUploaderStore) {
            return;
        }

        this.unsubscribeFromFilesStore = filesUploaderStore.subscribe(
            ({ files }) => {
                this.setState({
                    files
                });
            }
        );
    };

    createNote = async (payload: Note): Promise<void> => {
        const { title, description } = payload;

        await this.waitForFilesUploading();

        const { filesUploaderStore } = this.state;
        let uploadedFiles = [];

        if (filesUploaderStore) {
            uploadedFiles = filesUploaderStore.getState().files;
        }

        this.props.notesActions.addNoteRequest({
            title,
            description,
            files: uploadedFiles.map(({ downloadPath, name, id, size }) => ({
                downloadPath,
                name,
                id,
                size
            }))
        });

        if (filesUploaderStore) {
            filesUploaderStore.setState({ files: [] });
        }
    };

    waitForFilesUploading = async () => {
        await this.uploadingPromise;
    };

    validate = (payload: NoteValidate) => {
        const { title, description } = payload;
        const errors = {} as {
            title?: string;
            description?: string;
        };

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.description = 'Please enter description';
        }

        return errors;
    };

    render() {
        const { isLoggedIn } = this.props;
        const { files } = this.state;

        return (
            <Form
                className="add-note-form"
                onSubmit={this.onSubmit}
                validate={this.validate}
                render={({ pristine }) => (
                    <Fragment>
                        <Field
                            name="title"
                            component="input"
                            autoComplete="off"
                            placeholder="Note title..."
                            className="field-title"
                        />
                        <Field
                            name="description"
                            component={MultilineInput}
                            autoComplete="off"
                            placeholder="Note description..."
                            className="field-description"
                        />
                        <FilesList files={files} />
                        <div className="buttons-group">
                            <Button
                                type="submit"
                                theme="primary"
                                disabled={pristine}
                            >
                                Submit
                            </Button>

                            {isLoggedIn && (
                                <FilesUploader
                                    provideStore={this.setFilesUploaderStore}
                                    onUploadStateChanged={
                                        this.onUploadStateChanged
                                    }
                                />
                            )}
                        </div>
                    </Fragment>
                )}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNoteForm);
