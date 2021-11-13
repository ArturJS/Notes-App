import React from 'react';
import App from 'next/app';
import UserAuthState from '~/common/components/user-auth-state';
import Header from '~/common/components/header';
import '~/common/style/index.scss';
import '~/styles/globals.scss';

export default class BaseApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <div id="app">
                <Header>
                    <UserAuthState />
                </Header>
                <Component {...pageProps} />
            </div>
        );
    }
}
