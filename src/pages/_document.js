import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import UserAuthState from '../common/components/user-auth-state';
import Header from '../common/components/header';

export default class MyDocument extends Document {
    render() {
        const { buildStats } = this.props.__NEXT_DATA__;

        console.log(this.props.__NEXT_DATA__);

        return (
            <html>
                <Head>
                    {/* <link
                        rel="stylesheet"
                        type="text/css"
                        href={`/_next/${buildStats['app.js'].hash}/app.css`}
                    /> */}
                </Head>
                <body>
                    <div id="app">
                        <Header>
                            <UserAuthState />
                        </Header>
                        <Main />
                    </div>
                    <NextScript />
                </body>
            </html>
        );
    }
}
