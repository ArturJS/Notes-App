import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { compose, pure, withHandlers, toClass } from 'recompose';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const enhance = compose(
    pure,
    withHandlers({
        // eslint-disable-next-line react/prop-types
        renderError: ({ name }) => ({ meta: { touched, error } }) => {
            const showError = touched && error;

            return (
                <TransitionGroup>
                    {showError && (
                        <CSSTransition
                            key={name}
                            appear
                            timeout={350}
                            classNames="hopping-anim"
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className="field-error">{error}</div>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            );
        }
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
