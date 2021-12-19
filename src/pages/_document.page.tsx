// @ts-nocheck
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import _ from 'lodash';

export default class BaseDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    getStyles = _.memoize(() => {
        const isCss = (str) => str.indexOf('.css') > -1;
        const getVersion = (str) => {
            const [, version = ''] = /(\?v=.+)*$/.exec(str);

            return version;
        };

        return _.chain(this.props.buildManifest)
            .values()
            .filter(_.isArray)
            .flatten()
            .filter(_.isString)
            .filter(isCss)
            .uniqBy(getVersion)
            .value();
    });

    renderMetaTags = () => (
        <>
            <meta name="application-name" content="Notes App" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
            <meta name="apple-mobile-web-app-title" content="Notes App" />
            <meta name="description" content="Best Notes App in the world" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#f54b36" />

            <link rel="manifest" href="/manifest.json" />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content="https://react-notes.com" />
            <meta name="twitter:title" content="Notes App" />
            <meta
                name="twitter:description"
                content="Best Notes App in the world"
            />
            <meta name="twitter:creator" content="@ArturJS" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Notes App" />
            <meta
                property="og:description"
                content="Best Notes App in the world"
            />
            <meta property="og:site_name" content="Notes App" />
            <meta property="og:url" content="https://react-notes.com" />
        </>
    );

    render() {
        const isProduction = process.env.NODE_ENV === 'production';
        const styles = this.getStyles();

        return (
            <Html lang="en">
                <Head>
                    {this.renderMetaTags()}
                    {isProduction &&
                        styles.map((stylePath) => (
                            <link
                                href={`/static/${stylePath}`}
                                key={stylePath}
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
            </Html>
        );
    }
}
