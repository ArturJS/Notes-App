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
import _ from 'lodash';
import {
    RootComponent,
    ExposeFetchersComponent,
    configureStore
} from '../../build/ssr-build/ssr-bundle';

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
        const fetchInitialState = async () => {
            const fetchers = [];

            render(
                Preact.h(
                    ExposeFetchersComponent,
                    {
                        onRegisterFetcher: ({ key, fetcher }) => {
                            fetchers.push({ key, fetcher });
                        }
                    },
                    Preact.h(RootComponent, { url })
                )
            );

            const fetchKeys = fetchers.map(({ key }) => key);
            const fetchPromises = fetchers.map(({ fetcher }) => fetcher());

            try {
                const fetchedData = await Promise.all(fetchPromises);

                return _.zipObject(fetchKeys, fetchedData);
            } catch (err) {
                // TODO handle error
                return {};
            }
        };
        const initialState = await fetchInitialState();
        const serverReduxStore = configureStore(initialState);
        const appHtmlMarkup = render(
            Preact.h(RootComponent, { url, serverReduxStore })
        );
        const renderedPage = template.replace(RGX, appHtmlMarkup);

        ctx.body = renderedPage;
    });

export const ssrServer = app;
