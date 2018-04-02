import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';
import store from '../../store';
import UserAuthState from '../user-auth-state';
import Header from '../header';
import Home from '../../../routes/home';

const isServerSide = typeof window === 'undefined';

export default class App extends Component {
    static propTypes = {
        serverReduxStore: isServerSide
            ? PropTypes.func.isRequired
            : PropTypes.func
    };

    render() {
        // TODO pass server side url

        return (
            <Provider store={this.props.serverReduxStore || store}>
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
