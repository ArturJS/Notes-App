import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    const babelConfig = rule.options;

    babelConfig.plugins.push('lodash');

    if (env.production) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'webpack-bundle-report.html'
            })
        );
    }
};
