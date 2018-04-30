require('babel-register')({
    extensions: ['.js', '.mjs']
});
require('dotenv-safe').config({
    example: './.env.example',
    path: './.env'
});

// eslint-disable-next-line no-global-assign
// require = require('@std/esm')(module, {
//     cjs: true
// });
require('@zeit/next-preact/alias')();

module.exports = require('./main.mjs').default;
