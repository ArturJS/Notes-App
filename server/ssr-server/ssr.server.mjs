import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';
// import { initialStateUtils, ssrRendererUtils } from './utils';

const dev = process.env.NODE_ENV !== 'production';
const uiDirectory = path.resolve(__dirname, '../../src');
const app = next({ dir: uiDirectory, dev });
const handle = app.getRequestHandler();
const server = new Koa();
const router = new Router();

app.prepare().then(() => {
    router.get('*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });

    server.use(router.routes());

    console.log('SSR server is ready');
});

export const ssrServer = server;
