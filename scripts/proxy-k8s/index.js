const initServer = require('./init-server');

const {
    PORT = 1234
} = process.env;

initServer(PORT); // Well, it's time to begin!
