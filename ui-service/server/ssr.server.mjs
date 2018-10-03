import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import nextInit from 'next';
import config from '@config';
import routes from '../src/routes';

const dev = config.env.NODE_ENV === 'development';
const uiDirectory = path.resolve(__dirname, '../src');
const app = nextInit({ dir: uiDirectory, dev });
const handle = routes.getRequestHandler(app);
const server = new Koa();
const router = new Router();

const rootDir = path.resolve(__dirname, '../src');
const staticAssetsPath = path.resolve(rootDir, './.next');

app.prepare().then(() => {
    router.get('*', async ctx => {
        if (config.env.DOCKER_BUILD) {
            // todo: consider better placement for apiBaseUrl
            // todo: (get rid of hardcoded apiBaseUrl string)
            ctx.req.apiBaseUrl = 'http://api-service:3001/api';
        }

        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server
        .use(mount('/static', serveStatic(staticAssetsPath))) // here's better to use nginx
        .use(async (ctx, next) => {
            ctx.res.statusCode = 200;
            await next();
        })
        .use(router.routes());

    // eslint-disable-next-line no-console
    console.log('SSR server is ready'); // todo use logger
});

export const ssrServer = server;
