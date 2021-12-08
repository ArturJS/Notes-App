import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import UserAuthState from '~/common/components/user-auth-state';
import Header from '~/common/components/header';
import faviconIcon from '~/public/favicon.ico';
import appleFaviconIcon from '~/public/apple-favicon.png';
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
                <Head>
                    <link
                        rel="shortcut icon"
                        href={faviconIcon.src}
                        sizes="any"
                    />
                    <link rel="apple-touch-icon" href={appleFaviconIcon.src} />
                    <meta name="twitter:image" content={appleFaviconIcon.src} />
                    <meta property="og:image" content={appleFaviconIcon.src} />
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                    />
                </Head>
                <Header>
                    <UserAuthState />
                </Header>
                <Component {...pageProps} />
            </div>
        );
    }
}
