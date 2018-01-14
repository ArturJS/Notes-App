import { h, Component } from 'preact';
import { Form, Field } from 'react-final-form';

import firebaseProvider from '../../../../providers/firebase-provider';
import Button from '../../../../components/button';
import style from './add-note-form.scss';

export default class AddNoteForm extends Component {
    createNote = ({ title, description }) => {
        const notesRef = firebaseProvider.getCurrentUserData().child('notes');
        const newNoteId = notesRef.push().key;

        notesRef.child(newNoteId).update({ title, description });
    };

    onSubmit = (values, formApi) => {
        if (!firebaseProvider.isLoggedIn()) {
            return;
        }

        this.createNote(values);

        formApi.reset();
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

    render() {
        return (
            <Form
                onSubmit={this.onSubmit}
                validate={this.validate}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form
                        onSubmit={handleSubmit}
                        class={style.addNoteForm}
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

                        <Button
                            type="submit"
                            theme="primary"
                            disabled={pristine || invalid}>
                            Add
                        </Button>
                    </form>
                )}
            />
        );
    }
}
