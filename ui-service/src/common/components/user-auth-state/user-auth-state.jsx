import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure, compose, withHandlers } from 'recompose';
import { withRouter } from 'next/router';
import Button from '../button';
import { authActions, authSelectors } from '../../features/auth';
import withReduxStore from '../../hocs/with-redux-store';
import { authActionsPropType } from '../../prop-types/auth.prop-types';
import './user-auth-state.scss';

const mapStateToProps = state => {
    const { isLoggedIn } = authSelectors.getAuthState(state);

    return {
        isLoggedIn
    };
};

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
});

const enhance = compose(
    withReduxStore(),
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
    withHandlers({
        login: ({ router }) => () => {
            router.push('/login');
        },
        logout: ({
            // eslint-disable-next-line no-shadow
            authActions
        }) => () => {
            authActions.logoutRequest();
        }
    }),
    pure
);

const UserAuthState = ({ isLoggedIn, logout, login }) => (
    <div className="user-auth-state">
        {isLoggedIn ? (
            <Button theme="primary" onClick={logout}>
                Sign out &nbsp;
                <i className="icon icon-exit" />
            </Button>
        ) : (
            <Button theme="hot" onClick={login}>
                Sign in &nbsp;
                <i className="icon icon-enter" />
            </Button>
        )}
    </div>
);

UserAuthState.propTypes = {
    isLoggedIn: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    authActions: authActionsPropType.isRequired,
    logout: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
};

UserAuthState.defaultProps = {
    isLoggedIn: false
};

export default enhance(UserAuthState);
