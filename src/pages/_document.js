import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        // const { dir } = this.props;

        // console.log(this.props);

        return (
            <html lang="en">
                <Head>
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="/_next/static/style.css"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}