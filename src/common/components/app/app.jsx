import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';
import store from '../../store';
import UserAuthState from '../user-auth-state';
import Header from '../header';
import Home from '../../../routes/home';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div id="app">
                    <Header>
                        <UserAuthState />
                    </Header>
                    <Router>
                        <Home default />
                    </Router>
                </div>
            </Provider>
        );
    }
}
