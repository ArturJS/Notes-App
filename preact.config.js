import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    const {rule} = helpers.getLoadersByName(config, 'babel-loader')[0];
    const babelConfig = rule.options;

    babelConfig.plugins.push(
        'lodash',
        'transform-async-to-promises',
        'syntax-flow',
        'transform-flow-strip-types',
        [
            'transform-react-jsx',
            {
                'pragma': 'h'
            }
        ]
    );

    if (env.production) {
        const {plugin} = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0];
        plugin.options.sourceMap = false;

        config.output.publicPath = '/notes/';
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'webpack-bundle-report.html'
            })
        );
    }
};
