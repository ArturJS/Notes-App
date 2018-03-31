require('dotenv-safe').config({
    allowEmptyValues: true,
    example: './.env.example',
    path: './.env',
});

// eslint-disable-next-line no-global-assign
require = require('@std/esm')(module, {
    cjs: true,
});
module.exports = require('./main.mjs').default;
