// @flow
// import type { FormApi } from 'final-form/dist/types.js.flow';

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure } from 'recompose';
import _ from 'lodash';
import { filesApi } from '@common/api'; // todo: use redux actions
import Button from '@common/components/button';
import { authSelectors } from '@common/features/auth';
import { Form, Field } from '@common/features/form';
import { notesActionsPropType } from '@common/prop-types/notes.prop-types';
import MultilineInput from '@common/components/multiline-input';
import { notesActions } from '@common/features/notes';
import { modalProvider } from '@common/features/modal';
import FilesList from '../file-list';
import './add-note-form.scss';

type TFile = {|
    id: number,
    downloadPath: string,
    name: string,
    size: number
|};

type Note = {
    title: string,
    description: string
};

type NoteValidate = {
    title?: string,
    description?: string
};

type Props = {};

type State = {
    uploadedFiles: TFile[],
    filesList: File[],
    fileUploadPromises: Promise[]
};

const mapStateToProps = state => ({
    isLoggedIn: authSelectors.isLoggedIn(state)
});
const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
@pure
export default class AddNoteForm extends Component<Props, State> {
    static propTypes = {
        notesActions: notesActionsPropType.isRequired,
        isLoggedIn: PropTypes.bool.isRequired
    };

    state = {
        uploadedFiles: [],
        filesList: [],
        fileUploadPromises: []
    };

    onSubmit = async (values: Note, formApi) => {
        await this.createNote(values);

        formApi.reset();
        this.setState({ uploadedFiles: [] });
    };

    setFileInputRef = node => {
        this.fileInputRef = node;
    };

    resetFileInput = () => {
        const input = this.fileInputRef;

        input.value = '';

        if (!/safari/i.test(window.navigator.userAgent)) {
            input.type = '';
            input.type = 'file';
        }
    };

    validateTotalFilesSize = newFiles => {
        const TEN_MEGABYTES = 10 * 1024 * 1024;
        const allFiles = [...newFiles, ...this.state.uploadedFiles];
        const allFileSizes = allFiles.map(({ size }) => size);
        const totalFilesSize = allFileSizes.reduce(
            (acc, value) => acc + value,
            0
        );

        return totalFilesSize <= TEN_MEGABYTES;
    };

    attachFiles = async e => {
        // todo: validate and remove duplications
        const files = Array.from(e.target.files);
        const isInvalid = !this.validateTotalFilesSize(files);

        this.resetFileInput();

        if (isInvalid) {
            modalProvider.showError({
                title: 'Error!',
                body: 'Total allowed files size is 10 megabytes.'
            });

            return;
        }

        const fileUploadPromises = files.map(this.uploadFile);

        this.setState(prevState => ({
            fileUploadPromises: [
                ...prevState.fileUploadPromises,
                ...fileUploadPromises
            ],
            filesList: [...prevState.filesList, ...files]
        }));

        const uploadedFiles = await Promise.all(fileUploadPromises);

        this.setState({
            uploadedFiles: [...this.state.uploadedFiles, ...uploadedFiles],
            filesList: []
        });
    };

    uploadFile = async (file: File) => {
        const { id, downloadPath, name, size } = await filesApi.create(file);

        return {
            id,
            downloadPath,
            name,
            size
        };
    };

    removeFile = (fileToRemove: File | TFile): void => {
        // todo split method
        const uploadedFile = _.find(
            this.state.uploadedFiles,
            file => file.name === fileToRemove.name
        );

        this.setState(({ filesList, uploadedFiles }) => ({
            // todo cancel requests for not uploaded files
            filesList: filesList.filter(file => file !== fileToRemove),
            uploadedFiles: uploadedFiles.filter(file => file !== fileToRemove)
        }));

        if (!uploadedFile) {
            return;
        }

        filesApi.remove(uploadedFile.id);
    };

    validate = ({ title, description }: NoteValidate) => {
        const errors = {};

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.description = 'Please enter description';
        }

        return errors;
    };

    waitForFilesUploading = async () => {
        await Promise.all(this.state.fileUploadPromises);
    };

    createNote = async ({ title, description }: Note): Promise<void> => {
        await this.waitForFilesUploading();

        this.props.notesActions.addNoteRequest({
            title,
            description,
            files: this.state.uploadedFiles.map(
                ({ downloadPath, name, id, size }) => ({
                    downloadPath,
                    name,
                    id,
                    size
                })
            )
        });
    };

    render() {
        const { isLoggedIn } = this.props;
        const { filesList, uploadedFiles } = this.state;

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
                        />
                        <Field
                            name="description"
                            component={MultilineInput}
                            autoComplete="off"
                            placeholder="Note description..."
                        />
                        <FilesList
                            files={uploadedFiles}
                            onRemove={this.removeFile}
                        />
                        <FilesList
                            files={filesList}
                            onRemove={this.removeFile}
                        />
                        <div className="buttons-group">
                            <Button
                                type="submit"
                                theme="primary"
                                disabled={pristine}
                            >
                                Submit
                            </Button>

                            {isLoggedIn && (
                                <Button
                                    type="button"
                                    className="btn-file"
                                    theme="hot"
                                >
                                    <input
                                        type="file"
                                        multiple
                                        ref={this.setFileInputRef}
                                        onChange={this.attachFiles}
                                    />
                                    Attach files
                                </Button>
                            )}
                        </div>
                    </Fragment>
                )}
            />
        );
    }
}
