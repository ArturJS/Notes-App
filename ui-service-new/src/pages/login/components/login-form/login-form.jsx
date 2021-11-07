import React from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps, withStateHandlers, withHandlers } from 'recompose';
import { Form, Field } from '~/common/features/form';
import Button from '~/common/components/button';

const enhance = compose(
    withStateHandlers(
        {
            submitSucceeded: false,
            submitFailed: false
        },
        {
            setSubmitStatus: () => ({
                submitSucceeded = false,
                submitFailed = false
            }) => ({
                submitSucceeded,
                submitFailed
            })
        }
    ),
    withHandlers({
        withSubmitStatus: ({ setSubmitStatus }) => onSubmitFn => async (
            ...args
        ) => {
            try {
                await onSubmitFn(...args);

                setSubmitStatus({
                    submitSucceeded: true
                });
            } catch (err) {
                setSubmitStatus({
                    submitFailed: true
                });
            }
        }
    }),
    mapProps(({ onSubmit, withSubmitStatus, ...restProps }) => ({
        ...restProps,
        onSubmit: withSubmitStatus(onSubmit)
    }))
);

const LoginForm = ({
    onSubmit,
    validate,
    buttonText,
    submitSucceeded,
    submitFailed
}) => (
    <Form
        className="login-form"
        onSubmit={onSubmit}
        validate={validate}
        render={() => (
            <>
                <Field
                    name="email"
                    component="input"
                    autoComplete="off"
                    placeholder="Your email"
                    autoFocus
                />
                <div className="buttons-group">
                    <Button type="submit" theme="primary">
                        {buttonText}
                    </Button>
                </div>
                {submitSucceeded && (
                    <p className="login-form__info">
                        The authentication link has been sent.
                    </p>
                )}
                {submitFailed && (
                    <p className="login-form__info">
                        Something went wrong... Please try again later.
                    </p>
                )}
            </>
        )}
    />
);

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    submitFailed: PropTypes.bool.isRequired
};

export default enhance(LoginForm);
