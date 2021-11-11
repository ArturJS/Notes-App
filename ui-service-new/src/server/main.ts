import session from 'koa-session';
import cors from '@koa/cors';
import config from '@root/common/config';
import logger from '@root/common/logger';
import { errorMiddleware } from '@root/common/middlewares';
import { configurePassport } from '@root/common/configure-passport';
import { apiServer } from './api.server';

// require('dotenv-safe').config({
//     example: '../../.env.example',
//     path: '../../.env'
// });

const { PORT } = config.server;
const { AUTH_SESSION_SECRET } = config.auth;

apiServer.keys = [AUTH_SESSION_SECRET];

apiServer
    .use(
        cors({
            credentials: true
        })
    )
    .use(async (ctx, next) => {
        ctx.request.body = ctx.request.req.body;

        await next();
    })
    .use(errorMiddleware)
    .use(session({}, apiServer));

configurePassport(apiServer);

export default apiServer.callback();
