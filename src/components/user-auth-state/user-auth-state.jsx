import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure } from 'recompose';

import Button from '../button';
import firebaseProvider from '../../providers/firebase-provider';
import { authActions, authSelectors } from '../../features/auth';
import './user-auth-state.scss';

const mapStateToProps = state => {
    const { isLoggedIn } = authSelectors.getAuthState(state);

    return {
        isAuthReady: isLoggedIn !== null,
        isLoggedIn
    };
};

const mapDispatchToProps = dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    });

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

    componentDidMount() {
        const { loginSuccess, loginFailure } = this.props.authActions;

        const unsubscribe = firebaseProvider.auth.onAuthStateChanged(user => {
            if (user) {
                loginSuccess({
                    id: user.uid,
                    email: user.email
                });
            } else {
                loginFailure();
            }
            unsubscribe();
        });
    }

    login = () => {
        this.props.authActions.loginRequest();
    };

    logout = () => {
        this.props.authActions.logoutRequest();
    };

    render() {
        const { isAuthReady, isLoggedIn } = this.props;

        if (!isAuthReady) {
            return null;
        }

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
