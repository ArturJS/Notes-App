const { execSync } = require('child_process');
const Koa = require('koa');
const proxy = require('koa-proxy');

const app = new Koa();
const PORT = 1234;
const host = execSync('minikube service ui-service --url').toString('utf8').replace(/\n/, '');

app.use(proxy({
    host,
    match: /.*/,
    followRedirect: false,
    jar: true
}));

app.listen(PORT, () => {
    console.log(`proxy-k8s is up and running on ${PORT}`);
});
