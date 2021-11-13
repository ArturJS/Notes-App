import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import _ from 'lodash';

export default class BaseDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    getStyles = _.memoize(() => {
        const isCss = str => str.indexOf('.css') > -1;
        const getVersion = str => {
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

    render() {
        const isProduction = process.env.NODE_ENV === 'production';
        const styles = this.getStyles();

        return (
            <Html lang="en">
                <Head>
                    {isProduction &&
                        styles.map(stylePath => (
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
