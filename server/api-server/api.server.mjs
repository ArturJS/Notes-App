import Koa from 'koa';
import cache from 'koa-redis-cache';
import routes from './routes';

const app = new Koa();

// docker run --name redis -p 6379:6379 -d redis:alpine
// docker stop $(docker ps -a -q)

const { REDIS_HOST, REDIS_PORT } = process.env; // todo: move all "process.env" to common server config

app
    .use(
        cache({
            expire: 5,
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT
            }
        })
    )
    .use(routes.routes());

export const apiServer = app;
