import Koa from 'koa';
import session from 'koa-session';
import bodyParser from 'koa-body';
import cors from '@koa/cors';
import config from '~/server/common/config';
import {
    errorMiddleware,
    requestInfoMiddleware
} from '~/server/common/middlewares';
import { configurePassport } from '~/server/common/configure-passport';
import routes from './routes';

const { AUTH_SESSION_SECRET } = config.auth;

const app = new Koa();

// @ts-ignore
app.keys = [AUTH_SESSION_SECRET];
app.proxy = true; // in order to get real ip address

app.use(requestInfoMiddleware)
    .use(errorMiddleware)
    .use(
        cors({
            credentials: true
        })
    )
    .use(session({}, app))
    .use(bodyParser());

configurePassport(app); // must be after session but before routes!

app.use(routes.routes());

export default app.callback();
