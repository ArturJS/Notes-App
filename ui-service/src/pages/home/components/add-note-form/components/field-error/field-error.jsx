// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { toClass } from 'recompose';
import './field-error.scss';

const FieldError = ({ name }) => (
    <Field
        name={name}
        subscription={{ touched: true, error: true }}
        render={({ meta: { touched, error } }) =>
            touched && error ? <div className="field-error">{error}</div> : null
        }
    />
);

FieldError.propTypes = {
    name: PropTypes.string.isRequired
};

export default toClass(FieldError);
