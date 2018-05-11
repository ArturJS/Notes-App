import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import config from '@config';
import webpackIsomorphicToolsConfig from '../../scripts/webpack-isomorphic-tools/webpack-isomorphic-tools.config';

const dev = config.env.NODE_ENV === 'development';
const uiDirectory = path.resolve(__dirname, '../../src');
const app = next({ dir: uiDirectory, dev });
const handle = app.getRequestHandler();
const server = new Koa();
const router = new Router();

global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    webpackIsomorphicToolsConfig
);

const rootDir = path.resolve(__dirname, '../../src');

Promise.all([app.prepare(), webpackIsomorphicTools.server(rootDir)]).then(
    () => {
        router.get('*', async ctx => {
            await handle(ctx.req, ctx.res);
            ctx.respond = false;
        });

        // eslint-disable-next-line no-shadow
        server.use(async (ctx, next) => {
            ctx.res.statusCode = 200;
            await next();
        });

        server.use(router.routes());

        // eslint-disable-next-line no-console
        console.log('SSR server is ready');
    }
);

export const ssrServer = server;
