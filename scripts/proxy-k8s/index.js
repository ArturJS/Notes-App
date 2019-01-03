const Koa = require('koa');
const proxy = require('koa-proxy');
const { getTargetHost } = require('./utils');

const app = new Koa();
const PORT = 1234;

app.use(proxy({
    host: getTargetHost(),
    match: /.*/,
    followRedirect: false,
    jar: true
}));

app.listen(PORT, () => {
    console.log(`proxy-k8s is up and running on ${PORT}`);
});
