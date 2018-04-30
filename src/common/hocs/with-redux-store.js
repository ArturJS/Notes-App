import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

const withReduxStore = Page => class WithReduxStore extends React.Component {
        render() {
            return (
                <Provider store={store}>
                    <Page />
                </Provider>
            );
        }
    };

export default withReduxStore;
