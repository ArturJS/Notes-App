import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { toClass } from 'recompose';
import UserAuthState from '../components/user-auth-state';
import Header from '../components/header';

const withRootLayout = WrappedComponent => {
    const EnhancedComponent = props => (
        <div id="app">
            <Header>
                <UserAuthState />
            </Header>
            <WrappedComponent {...props} />
        </div>
    );

    EnhancedComponent.displayName = `withReduxStore(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

    return toClass(hoistNonReactStatics(EnhancedComponent, WrappedComponent));
};

export default withRootLayout;
