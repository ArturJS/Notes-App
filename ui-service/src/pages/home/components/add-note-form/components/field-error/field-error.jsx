// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { compose, pure, withHandlers, toClass } from 'recompose';
import './field-error.scss';

const enhance = compose(
    pure,
    withHandlers({
        // eslint-disable-next-line react/prop-types
        renderError: () => ({ meta: { touched, error } }) =>
            touched && error ? <div className="field-error">{error}</div> : null
    })
);

const FieldError = ({ name, renderError }) => (
    <Field
        name={name}
        subscription={{ touched: true, error: true }}
        render={renderError}
    />
);

FieldError.propTypes = {
    name: PropTypes.string.isRequired,
    renderError: PropTypes.func.isRequired
};

export const FieldErrorClass = toClass(FieldError);
export default enhance(FieldErrorClass);
