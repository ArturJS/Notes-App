import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class BaseDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    render() {
        const isProduction = process.env.NODE_ENV === 'production';
        const assets = webpackIsomorphicTools.assets();

        return (
            <html lang="en">
                <Head>
                    {isProduction &&
                        Object.keys(assets.styles).map((style, key) => (
                            <link
                                href={'/_next/' + assets.styles[style]}
                                key={key}
                                rel="stylesheet"
                                type="text/css"
                                charSet="UTF-8"
                            />
                        ))}
                </Head>
                <body>
                    <pre>{JSON.stringify(assets.styles, null, '  ')}</pre>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
