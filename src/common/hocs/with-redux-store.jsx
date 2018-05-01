import React from 'react';
import { Provider } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { toClass } from 'recompose';
import store from '../store';

const withReduxStore = WrappedComponent => {
    const EnhancedComponent = props => (
        <Provider store={store}>
            <WrappedComponent {...props} />
        </Provider>
    );

    EnhancedComponent.displayName = `withReduxStore(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

    return toClass(hoistNonReactStatics(EnhancedComponent, WrappedComponent));
};

export default withReduxStore;
