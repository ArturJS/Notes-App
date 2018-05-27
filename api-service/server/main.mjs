import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import cors from '@koa/cors';
import config from '@root/common/config';
import { errorMiddleware } from '@root/common/middlewares';
import { configurePassport } from '@root/common/configure-passport';
import { apiServer } from './api.server';

const app = new Koa();
const { PORT } = config.server;
const { AUTH_SESSION_SECRET } = config.auth;

app.keys = [AUTH_SESSION_SECRET];

app
    .use(
        cors({
            credentials: true
        })
    )
    .use(bodyParser())
    .use(errorMiddleware)
    .use(session({}, app));

configurePassport(app);

app
    .use(mount('/api', apiServer))
    .listen(PORT, () => {
        // todo use winston logger
        // eslint-disable-next-line no-console
        console.log(`Server is listening at ${PORT} port`);
    });
