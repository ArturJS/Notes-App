import Koa from 'koa';
import session from 'koa-session';
import cors from '@koa/cors';
import config from '@root/common/config';
import { errorMiddleware } from '@root/common/middlewares';
import { configurePassport } from '@root/common/configure-passport';
import routes from './routes';

const { AUTH_SESSION_SECRET } = config.auth;


const app = new Koa();

app.keys = [AUTH_SESSION_SECRET];

app
    .use(
        cors({
            credentials: true
        })
    )
    .use(session({}, app))
    .use(async (ctx, next) => {
        ctx.request.body = ctx.request.req.body;

        await next();
    })
    .use(errorMiddleware);

configurePassport(app); // must be after session but before routes!

app.use(routes.routes());

export default app.callback();
