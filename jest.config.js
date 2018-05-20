module.exports = {
    collectCoverageFrom: [
        'server/**/*.mjs',
        'src/**/*.{js,jsx}',
        '!server/**/index.mjs',
        '!src/**/*.test.{js,jsx}',
        '!src/**/*index.{js,jsx}'
    ],
    setupFiles: ['<rootDir>/scripts/tools/jest/__mocks__/browser-mocks.js'],
    testURL: 'http://localhost:8080',
    transform: {
        '\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.scss$': './scripts/tools/jest/css-transform.js'
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(m?jsx?)$',
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['js', 'jsx', 'mjs'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/tests/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': 'identity-obj-proxy',
        '^./style$': 'identity-obj-proxy',
        '@root': '<rootDir>/server/',
        '@config': 'identity-obj-proxy'
    },
    verbose: true
};
