import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Form as FinalForm } from 'react-final-form';
import _ from 'lodash';

const enhance = compose(pure);

const Form = ({ render, onSubmit, validate, className, initialValues }) => (
    <FinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        render={props => (
            <form // eslint-disable-next-line react/prop-types
                onSubmit={props.handleSubmit}
                className={className}
                noValidate
            >
                {render(props)}
            </form>
        )}
    />
);

Form.propTypes = {
    render: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialValues: PropTypes.object,
    validate: PropTypes.func,
    className: PropTypes.string
};

Form.defaultProps = {
    initialValues: null,
    validate: _.noop,
    className: ''
};

export default enhance(Form);
