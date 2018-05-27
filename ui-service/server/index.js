require('babel-register')({
    extensions: ['.js', '.mjs']
});
require('dotenv-safe').config({
    example: './.env.example',
    path: './.env'
});

module.exports = require('./main.mjs').default;
