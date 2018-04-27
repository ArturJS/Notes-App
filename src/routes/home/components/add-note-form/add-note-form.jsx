// @flow
// @jsx h
import type { FormApi } from 'final-form/dist/types.js.flow';

import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure } from 'recompose';
import _ from 'lodash';
import FieldError from './components/field-error';
import { filesApi } from '../../../../common/api'; // todo: use redux actions
import Button from '../../../../common/components/button';
import MultilineInput from '../../../../common/components/multiline-input';
import { notesActions } from '../../../../common/features/notes';
import FilesList from '../file-list';
import './add-note-form.scss';

type TFile = {|
    id: number,
    downloadPath: string,
    name: string
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

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

@connect(null, mapDispatchToProps)
@pure
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
        ).isRequired,
        notesActions: PropTypes.object.isRequired
    };

    state: State = {
        uploadedFiles: [],
        filesList: [],
        fileUploadPromises: []
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
                ({ downloadPath, name, id }) => ({
                    downloadPath,
                    name,
                    id
                })
            )
        });
    };

    onSubmit = async (values: Note, formApi: FormApi) => {
        // if (!firebaseProvider.isLoggedIn()) {
        //     // todo @connect with authState
        //     return;
        // }

        await this.createNote(values);

        formApi.reset();
        this.setState({ uploadedFiles: [] });
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

    removeFile = (fileToRemove: File): void => {
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

    uploadFile = async (file: File) => {
        const { id, downloadPath, name } = await filesApi.create(file);

        return {
            id,
            downloadPath,
            name
        };
    };

    attachFiles = async e => {
        // todo: validate and remove duplications
        const files = Array.from(e.target.files);
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

    render() {
        const { filesList, uploadedFiles } = this.state;

        return (
            <Form
                onSubmit={this.onSubmit}
                validate={this.validate}
                render={({ handleSubmit, pristine }) => (
                    <form
                        onSubmit={handleSubmit}
                        className={'add-note-form'}
                        noValidate>
                        <div className="control-field">
                            <Field
                                name="title"
                                component="input"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Note title..."
                            />
                            <FieldError name="title" />
                        </div>
                        <div className="control-field">
                            <Field
                                name="description"
                                component={MultilineInput}
                                className="form-control"
                                autoComplete="off"
                                placeholder="Note description..."
                            />
                            <FieldError name="description" />
                        </div>
                        <FilesList
                            files={uploadedFiles}
                            onRemove={this.removeFile}
                        />
                        <FilesList
                            files={filesList}
                            onRemove={this.removeFile}
                        />
                        <div className={'buttons-group'}>
                            <Button
                                type="submit"
                                theme="primary"
                                disabled={pristine}>
                                Submit
                            </Button>

                            <Button
                                type="button"
                                className={'btn-file'}
                                theme="hot">
                                <input
                                    type="file"
                                    multiple
                                    onChange={this.attachFiles}
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
