import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    const {rule} = helpers.getLoadersByName(config, 'babel-loader')[0];
    const babelConfig = rule.options;

    babelConfig.plugins.push(
        'lodash',
        'syntax-flow',
        'transform-flow-strip-types',
        'transform-regenerator',
        [
            'transform-react-jsx',
            {
                'pragma': 'h'
            }
        ]
    );

    if (env.production) {
        // TODO : fix the problem when building ssr bundle
        // const uglifyJsPlugins = helpers.getPluginsByName(config, 'UglifyJsPlugin');
        //
        // if (uglifyJsPlugins) {
        //     console.log(JSON.stringify(uglifyJsPlugins, null, '  '));
        //     const {plugin} = uglifyJsPlugins[0];
        //
        //     if (plugin) {
        //         plugin.options.sourceMap = false;
        //     }
        // }

        // config.output.publicPath = '/notes/';

        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'webpack-bundle-report.html'
            })
        );
    }
};
