// @flow
import React, { Component } from 'react';
import { Field } from 'react-final-form';
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

export default FieldError;
