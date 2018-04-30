const withPreact = require('@zeit/next-preact');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const withExludeModule = (config, excludeRegExp) => {
    config.module.rules.push({
        test: excludeRegExp,
        use: 'null-loader'
    });
};

const withFonts = config => {
    config.module.rules.push(
        {
            test: /\.woff2?(\?\S*)?$/,
            // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
            // loader: "url?limit=10000"
            use: 'url-loader'
        },
        {
            test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
            use: 'file-loader'
        }
    );
};

const withStyles = (config, { dev, isServer }) => {
    const production = !dev;

    if (dev) {
        if (isServer) {
            withExludeModule(config, /\.s?css$/);
        } else {
            config.module.rules.push({
                test: /\.s?css$/,
                loader:
                    'style-loader!css-loader?importLoaders=1!postcss-loader!sass-loader'
            });
        }
    } else if (production) {
        config.module.rules.push(
            {
                test: /\.(css|scss)/,
                loader: 'emit-file-loader',
                options: {
                    name: 'dist/[path][name].[ext]'
                }
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:
                        'css-loader?importLoaders=2&minimize=true!postcss-loader?parser=postcss-scss!sass-loader?outputStyle=expanded'
                })
            }
        );
        config.plugins.push(
            new ExtractTextPlugin({
                // filename: '[name]-[chunkhash].css',
                filename: 'static/style.css',
                allChunks: true
            })
        );
    }
};

const withFlowSupport = (config, { defaultLoaders }) => {
    for (const r of config.module.rules) {
        if ([r.loader, r.use].includes(defaultLoaders.babel)) {
            r.test = /\.(js|jsx|flow)$/;
        }
    }
};

module.exports = withPreact({
    // distDir: './build',
    // dir: './src',
    webpack(config, { dev, isServer, defaultLoaders }) {
        withFonts(config);
        withStyles(config, { dev, isServer });
        withExludeModule(config, /source-map-support/);
        withFlowSupport(config, { defaultLoaders });

        return config;
    },
    exportPathMap() {
        return {
            '/': { page: '/home' }
        };
    }
});
