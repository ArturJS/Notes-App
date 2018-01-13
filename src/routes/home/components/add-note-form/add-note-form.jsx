import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

import Button from '../../../../components/button';
import style from './add-note-form.scss';

export default class AddNoteForm extends Component {
    static propTypes = {
        onAddNote: PropTypes.func.isRequired
    };

    onSubmit = (values, formApi) => {
        formApi.reset();
        this.props.onAddNote(values);
    };

    validate = ({ title, description }) => {
        const errors = {};

        if (!title || !title.trim()) {
            errors.title = 'Please enter title';
        }
        if (!description || !description.trim()) {
            errors.title = 'Please enter desctiption';
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
