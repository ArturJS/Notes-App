import React from 'react';
import UserAuthState from '../components/user-auth-state';
import Header from '../components/header';

const withRootLayout = Page =>
    class WithRootLayout extends React.Component {
        render() {
            return (
                <div id="app">
                    <Header>
                        <UserAuthState />
                    </Header>
                    <Page />
                </div>
            );
        }
    };

export default withRootLayout;
