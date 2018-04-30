import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure } from 'recompose';
import Button from '../button';
import { authActions, authSelectors } from '../../features/auth';
import withReduxStore from '../../hocs/with-redux-store';
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

@withReduxStore
@connect(mapStateToProps, mapDispatchToProps)
@pure
export default class UserAuthState extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool,
        isAuthReady: PropTypes.bool.isRequired
    };

    static defaultProps = {
        isLoggedIn: false
    };

    login = () => {
        this.props.authActions.loginRequest();
    };

    logout = () => {
        this.props.authActions.logoutRequest();
    };

    render() {
        const { isLoggedIn } = this.props;

        return (
            <div className={'user-auth-state'}>
                {isLoggedIn ? (
                    <Button theme="primary" onClick={this.logout}>
                        Sign out &nbsp;
                        <i className={'icon icon-exit'} />
                    </Button>
                ) : (
                    <Button theme={'hot'} onClick={this.login}>
                        Sign in &nbsp;
                        <i className={'icon icon-enter'} />
                    </Button>
                )}
            </div>
        );
    }
}
