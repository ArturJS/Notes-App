// @flow
import path from 'path';
import zlib from 'zlib';
import Koa from 'koa';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import favicon from 'koa-favicon';
import compress from 'koa-compress';
import staticCache from 'koa-static-cache';
import _ from 'lodash';
import { initialStateUtils, ssrRendererUtils } from './utils';

const app = new Koa();
const staticAssetsPath = path.resolve(__dirname, '../../build');
const faviconPath = path.resolve(__dirname, '../../build/favicon.ico');

const getUserEmail = ctx => _.get(ctx, 'session.passport.user.email');
const { getInitialState } = initialStateUtils;
const { renderPage } = ssrRendererUtils;

app
    .use(favicon(faviconPath))
    .use(
        // todo: consider using nginx
        compress({
            flush: zlib.Z_SYNC_FLUSH
        })
    )
    .use(
        // todo: consider using nginx
        staticCache(staticAssetsPath, {
            maxAge: 365 * 24 * 60 * 60,
            filter: filename => filename.indexOf('sw.js') === -1
        })
    )
    .use(mount('/build', serveStatic(staticAssetsPath)))
    .use(async ctx => {
        const { url }: { url: string } = ctx.request;
        const { cookie }: { cookie?: string } = ctx.request.header;
        const email: ?string = getUserEmail(ctx);
        const initialState: Object = await getInitialState({
            url,
            cookies: cookie,
            email
        });
        const renderedPage: string = renderPage({
            initialState,
            url
        });

        ctx.body = renderedPage;
    });

export const ssrServer = app;
