import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    const {rule} = helpers.getLoadersByName(config, 'babel-loader')[0];
    const babelConfig = rule.options;
    const moduleRuleWithBabelLoader = helpers.getRules(config)
        .find((moduleRule) => moduleRule.rule.loader === 'babel-loader');

    // TODO: split into several methods
    moduleRuleWithBabelLoader.rule.test = /\.(js|jsx|flow)$/;

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
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'webpack-bundle-report.html'
            })
        );
    } else {
        babelConfig.plugins.push(
            [
                'flow-runtime',
                {
                    'assert': true,
                    'annotate': true
                }
            ]
        );
    }
};
