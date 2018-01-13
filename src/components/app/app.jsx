import { h, Component } from 'preact';
import { Router } from 'preact-router';

import UserAuthState from '../user-auth-state';
import Header from '../header';
import Home from '../../routes/home';

export default class App extends Component {
    render() {
        return (
            <div id="app">
                <Header>
                    <UserAuthState />
                </Header>
                <Router>
                    <Home default />
                </Router>
            </div>
        );
    }
}
