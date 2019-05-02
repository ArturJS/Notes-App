import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose';
import { authApi } from '@common/api';
import { Form, Field } from '@common/features/form';
import Button from '@common/components/button';
import './login.scss';

const enhance = compose(
    withRouter,
    withStateHandlers(
        {
            isPending: true,
            isFailed: false
        },
        {
            reportFailure: () => () => ({
                isPending: false,
                isFailed: true
            })
        }
    ),
    lifecycle({
        async componentDidMount() {
            const { router, reportFailure } = this.props;
            const { token } = router.query || {};

            try {
                await authApi.loginViaToken(token);

                router.push('/');
            } catch (err) {
                reportFailure();
            }
        }
    }),
    withHandlers({
        validateForm: () => ({ email }) => {
            const errors = {};

            if (!email || !email.trim()) {
                errors.email = 'Please enter email';
            }

            return errors;
        },
        resendAuthToken: () => ({ email }) => {
            authApi.sendAuthToken(email);
        }
    })
);

const Login = ({ isPending, isFailed, resendAuthToken, validateForm }) => (
    <div className="login-page">
        {isPending && <p>Verifying auth token... Please wait.</p>}
        {isFailed && (
            <>
                <p>
                    Authentication failed. It might happen due to expired auth
                    token.
                </p>
                <Form
                    className="login-form"
                    onSubmit={resendAuthToken}
                    validate={validateForm}
                    render={() => (
                        <>
                            <Field
                                name="email"
                                component="input"
                                autoComplete="off"
                                placeholder="Your email"
                                className="field-title"
                            />
                            <div className="buttons-group">
                                <Button type="submit" theme="primary">
                                    Resend auth token
                                </Button>
                            </div>
                        </>
                    )}
                />
            </>
        )}
    </div>
);

Login.propTypes = {
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    resendAuthToken: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired
};

export default enhance(Login);
