module.exports = {
    presets: [
        '@babel/preset-flow',
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '8.9.1',
                },
                useBuiltIns: 'usage',
            },
        ],
    ],
    plugins: [
        'transform-decorators-legacy',
        '@babel/plugin-proposal-pipeline-operator',
        [
            '@babel/plugin-proposal-object-rest-spread',
            { loose: true, useBuiltIns: true },
        ],
    ],
    env: {
        production: {
            plugins: ['transform-flow-strip-types'],
        },
        development: {
            plugins: [
                [
                    'flow-runtime',
                    {
                        assert: true,
                        annotate: true,
                    },
                ],
            ],
        },
    },
};
