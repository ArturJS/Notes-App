import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../../routes/home';

export default class App extends Component {
    render() {
        return (
            <div id="app">
                <Router>
                    <Home default />
                </Router>
            </div>
        );
    }
}
