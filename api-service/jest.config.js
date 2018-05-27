module.exports = {
    collectCoverageFrom: [
        'server/**/*.mjs',
        '!server/**/*.test.{js,mjs}',
        '!server/**/*index.{js,mjs}'
    ],
    testURL: 'http://localhost:8080',
    transform: {
        '\\.(js|mjs)$': '<rootDir>/node_modules/babel-jest'
    },
    testRegex: '(/__tests__/.*|\\.test)\\.(m?js)$',
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|mjs)$'],
    moduleFileExtensions: ['js', 'mjs'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '@root': '<rootDir>/server/',
        '@config': 'identity-obj-proxy'
    },
    verbose: true
};
