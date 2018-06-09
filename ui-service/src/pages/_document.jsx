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
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    {isProduction &&
                        Object.keys(assets.styles).map(style => (
                            <link
                                href={`/static/${assets.styles[style]}`}
                                key={style}
                                rel="stylesheet"
                                type="text/css"
                                charSet="UTF-8"
                            />
                        ))}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
