module.exports = {
    presets: [
        '@babel/preset-flow',
        [
            '@babel/preset-env',
            {
                'targets': {
                    'node': '8.9.1'
                }
            }
        ]
    ],
    plugins: [
        'transform-decorators-legacy'
    ],
    env: {
        production: {
            plugins: [
                'transform-flow-strip-types'
            ]
        },
        development: {
            plugins: [
                [
                    'flow-runtime',
                    {
                        'assert': true,
                        'annotate': true
                    }
                ]
            ]
        }
    }
};
