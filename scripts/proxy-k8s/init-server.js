const { execSync } = require('child_process');
const http = require('http');
const Koa = require('koa');
const proxy = require('koa-proxy');
const makeDestroyable = require('server-destroy');

const getTargetHost = () => {
    const getTargetEndpoint = [
        "kubectl describe service ui-service",
        "grep 'Endpoints'"
    ].join(' | ');
    const host = execSync(getTargetEndpoint).toString('utf8').replace(/[^0-9]+/, '').replace(/\n/, '');

    return `http://${host}/`;
};

const createServer = (port) => {
    const app = new Koa();
    const host = getTargetHost();

    console.log(`Target host: ${host}`);

    app.use(proxy({
        host,
        match: /.*/,
        followRedirect: false,
        jar: true
    }));

    app.on('error', (error) => {
        // rethrow error
        server.emit('error', error);
    });

    const server = http.createServer(app.callback());

    server.listen(port, () => {
        console.log(`proxy-k8s is up and running on ${port}`);
    });

    return server;
};

const withDestroy = server => {
    makeDestroyable(server);

    return server;
};

const withRestartAfterError = (destroyableServer, port) => {
    if (!destroyableServer.destroy) {
        throw new Error(
            [
                'Server is NOT destroyable!',
                'Make sure you wrapped it with \'server-destroy\'.'
            ].join(' ')
        );
    }

    destroyableServer.on('error', (error) => {
        console.log('Damn... There is an error: ', error);
        console.log('Reloading!');

        // no matter what, we need to restart this...
        destroyableServer.destroy();
        initServer(port); // and once again)
    });
};

const initServer = (port) => {
    const server = createServer(port);
    const destroyableServer = withDestroy(server);

    withRestartAfterError(destroyableServer, port);
};

module.exports = initServer;
