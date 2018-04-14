require('@babel/register');
require('dotenv-safe').config({
    example: './.env.example',
    path: './.env'
});

// eslint-disable-next-line no-global-assign
require = require('@std/esm')(module, {
    cjs: true
});

module.exports = require('./main.mjs').default;
