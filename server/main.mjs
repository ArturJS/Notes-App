import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import cors from '@koa/cors';
import { errorMiddleware } from './common/middlewares';
import { ssrServer } from './ssr-server';
import { apiServer } from './api-server';
import { configurePassport } from './common/configure-passport';

const app = new Koa();
const { PORT = 3000, AUTH_SESSION_SECRET } = process.env;

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
    .use(mount('/', ssrServer))
    .listen(PORT, () => {
        console.log(`Server is listening ${PORT} port`);
    });
