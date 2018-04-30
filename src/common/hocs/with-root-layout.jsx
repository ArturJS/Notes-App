import React from 'react';
import UserAuthState from '../components/user-auth-state';
import Header from '../components/header';

const withRootLayout = Page => () => (
    <div id="app">
        <Header>
            <UserAuthState />
        </Header>
        <Page />
    </div>
);

export default withRootLayout;
