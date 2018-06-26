require('babel-register')({
    extensions: ['.js', '.mjs']
});

if (!process.env.DOCKER_BUILD) {
    // eslint-disable-next-line global-require
    require('dotenv-safe').config({
        example: './.env.example',
        path: './.env'
    });
}

module.exports = require('./main.mjs').default;
