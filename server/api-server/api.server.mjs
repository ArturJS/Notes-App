import Koa from 'koa';
import cache from 'koa-redis-cache';
import routes from './routes';

const app = new Koa();

// docker run --name redis -p 6379:6379 -d redis:alpine
// docker stop $(docker ps -a -q)

app
    .use(
        cache({
            expire: 5,
            redis: {
                host: '192.168.99.100', // todo: move to .env file and create service in docker-compose.yml
                port: 6379
            }
        })
    )
    .use(routes.routes());

export const apiServer = app;
