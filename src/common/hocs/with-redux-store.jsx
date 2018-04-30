import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

const withReduxStore = WrappedComponent => () => (
    <Provider store={store}>
        <WrappedComponent />
    </Provider>
);

export default withReduxStore;
