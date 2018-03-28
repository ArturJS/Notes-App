import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import Preact from 'preact';
import render from 'preact-render-to-string';
import Koa from 'koa';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import favicon from 'koa-favicon';
import compress from 'koa-compress';
import staticCache from 'koa-static-cache';
import RootComponent from '../../build/ssr-build/ssr-bundle';

const app = new Koa();
const RGX = /<div id="app"[^>]*>.*?(?=<script)/i;
const template = fs.readFileSync(
    path.resolve(__dirname, '../../build/index.html'),
    'utf8'
);
const staticAssetsPath = path.resolve(__dirname, '../../build');
const faviconPath = path.resolve(__dirname, '../../build/favicon.ico');

app
    .use(favicon(faviconPath))
    .use(
        compress({
            flush: zlib.Z_SYNC_FLUSH
        })
    )
    .use(
        staticCache(staticAssetsPath, {
            maxAge: 365 * 24 * 60 * 60,
            filter: filename => filename.indexOf('sw.js') === -1
        })
    )
    .use(mount('/build', serveStatic(staticAssetsPath)))
    .use(async ctx => {
        const { url } = ctx.request;
        const appHtmlMarkup = render(Preact.h(RootComponent, { url }));
        const renderedPage = template.replace(RGX, appHtmlMarkup);

        ctx.body = renderedPage;
    });

export const ssrServer = app;

