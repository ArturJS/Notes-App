import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class BaseDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    render() {
        const isProduction = process.env.NODE_ENV === 'production';

        return (
            <html lang="en">
                <Head>
                    {isProduction && (
                        <link
                            rel="stylesheet"
                            type="text/css"
                            href="/_next/static/style.css"
                        />
                    )}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
