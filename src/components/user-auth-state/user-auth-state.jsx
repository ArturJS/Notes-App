import { h, Component } from 'preact';

import firebaseProvider from '../../providers/firebase-provider/index';
import Button from '../button/index';
import './user-auth-state.scss';

export default class UserAuthState extends Component {
    state = {
        isAuthReady: false,
        isLoggedIn: false
    };

    componentDidMount() {
        firebaseProvider.auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isAuthReady: true,
                    isLoggedIn: true
                });
            } else {
                this.setState({
                    isAuthReady: true,
                    isLoggedIn: false
                });
            }
        });
    }

    doSignIn = () => {
        firebaseProvider.login();
    };

    doSignOut = () => {
        firebaseProvider.logout();
    };

    render() {
        const { isAuthReady, isLoggedIn } = this.state;

        if (!isAuthReady) {
            return null;
        }

        return (
            <div className={'user-auth-state'}>
                {isLoggedIn ? (
                    <Button onClick={this.doSignOut}>
                        Sign out &nbsp;
                        <i className={'icon icon-exit'} />
                    </Button>
                ) : (
                    <Button theme={'Hot'} onClick={this.doSignIn}>
                        Sign in &nbsp;
                        <i className={'icon icon-enter'} />
                    </Button>
                )}
            </div>
        );
    }
}
