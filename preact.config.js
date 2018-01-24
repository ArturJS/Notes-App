import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    const babelConfig = rule.options;

    babelConfig.plugins.push('lodash', 'transform-async-to-promises');

    const { plugin } = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0];
    plugin.options.sourceMap = false;

    if (env.production) {
        config.output.publicPath = '/notes/';
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'webpack-bundle-report.html'
            })
        );
    }
};
