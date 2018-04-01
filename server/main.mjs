import Koa from 'koa';
import mount from 'koa-mount';
import session from 'koa-session';
import { ssrServer } from './ssr-server';
import { apiServer } from './api-server';

const app = new Koa();
const { PORT = 3000, AUTH_SESSION_SECRET } = process.env;

app.keys = [AUTH_SESSION_SECRET];

app
    .use(session({}, app))
    .use(mount('/api', apiServer))
    .use(mount('/', ssrServer))
    .listen(PORT, () => {
        console.log(`Server is listening ${PORT} port`);
    });
