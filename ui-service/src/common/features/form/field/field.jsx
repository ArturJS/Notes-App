import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import classNames from 'classnames';
import { Field as FinalField } from 'react-final-form';
import FieldError from './components/field-error';
import './field.scss';

const enhance = compose(pure);

const Field = ({
    className,
    name,
    component,
    placeholder,
    autoComplete,
    autoFocus
}) => (
    <div className={classNames('field', className)}>
        <FieldError name={name} />
        <FinalField
            name={name}
            component={component}
            className="field__control"
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
        />
    </div>
);

Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool
};

Field.defaultProps = {
    className: '',
    placeholder: '',
    autoComplete: '',
    autoFocus: false
};

export default enhance(Field);
