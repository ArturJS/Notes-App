import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import proxy from 'koa-proxy';
import config from '@config';
import { errorMiddleware } from '@root/common/middlewares';
import { ssrServer } from './ssr.server';

const app = new Koa();
const { PORT, API_URL } = config.server;
const { AUTH_SESSION_SECRET } = config.auth;

app.keys = [AUTH_SESSION_SECRET];

app
    .use(
        proxy({
            host: API_URL,
            match: /^\/api\//,
            followRedirect: false,
            jar: true
        })
    )
    .use(bodyParser())
    .use(errorMiddleware)
    .use(session({}, app));

app.use(mount('/', ssrServer)).listen(PORT, () => {
    // todo use winston logger
    // eslint-disable-next-line no-console
    console.log(`Server is listening ${PORT} port`);
});
