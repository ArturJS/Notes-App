import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose';
import { get } from 'lodash';
import { authApi } from '~/common/api';
import LoginForm from './components/login-form';
import './login.scss';

const checkIsLoginIntent = router => !get(router, 'query.token');

const enhance = compose(
    withRouter,
    withStateHandlers(
        ({ router }) => ({
            isLoginIntent: checkIsLoginIntent(router),
            isPending: true,
            isFailed: false
        }),
        {
            reportFailure: () => () => ({
                isPending: false,
                isFailed: true
            })
        }
    ),
    lifecycle({
        async componentDidMount() {
            const { router, reportFailure, isLoginIntent } = this.props;

            if (isLoginIntent) {
                return;
            }

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
        resendAuthToken: () => async ({ email }) => {
            await authApi.sendAuthToken(email);
        }
    })
);

const Login = ({
    isLoginIntent,
    isPending,
    isFailed,
    resendAuthToken,
    validateForm
}) => (
    <div className="login-page">
        {isPending &&
            !isLoginIntent && (
                <p className="login-info">
                    Verifying auth token... Please wait.
                </p>
            )}
        {(isFailed || isLoginIntent) && (
            <>
                {!isLoginIntent && (
                    <p className="login-info">
                        Authentication failed. It might happen due to expired
                        auth token.
                    </p>
                )}
                {isLoginIntent && (
                    <p className="login-info">
                        Please enter your email and we will send you
                        authentication link.
                    </p>
                )}
                <LoginForm
                    onSubmit={resendAuthToken}
                    validate={validateForm}
                    buttonText={`${
                        isLoginIntent ? 'Send' : 'Resend'
                    } auth link`}
                />
            </>
        )}
    </div>
);

Login.propTypes = {
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    resendAuthToken: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    isLoginIntent: PropTypes.bool.isRequired
};

export default enhance(Login);
