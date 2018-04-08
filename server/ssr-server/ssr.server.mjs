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
import serialize from 'serialize-javascript';
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

// todo simplify and split into several modules
const getFetchersByUrl = url => {
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

    return fetchers;
};

const fetchInitialState = async (fetchers, cookies) => {
    const fetchKeys = fetchers.map(({ key }) => key);
    const fetchPromises = fetchers.map(({ fetcher }) =>
        fetcher({
            headers: {
                Cookie: cookies
            }
        })
    );

    try {
        const fetchedData = await Promise.all(fetchPromises);

        return _.zipObject(fetchKeys, fetchedData);
    } catch (err) {
        // TODO handle error
        return {};
    }
};

const getUserEmail = ctx => _.get(ctx, 'session.passport.user.email');

const addAuthState = (initialState, ctx) => {
    // eslint-disable-next-line no-param-reassign
    initialState.auth = {
        isLoggedIn: true,
        isLoginPending: false,
        isLoginSuccess: null,
        isLogoutPending: false,
        isLogoutSuccess: null,
        authData: {
            email: getUserEmail(ctx)
        }
    };
};

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
        // todo simplify and split method
        const { url } = ctx.request;
        const { cookie } = ctx.request.header;
        const fetchersList = getFetchersByUrl(url);
        const initialState = await fetchInitialState(fetchersList, cookie);

        if (ctx.isAuthenticated()) {
            addAuthState(initialState, ctx);
        }

        const serverReduxStore = configureStore(initialState);
        const appHtmlMarkup = render(
            Preact.h(RootComponent, { url, serverReduxStore })
        );
        const initialAppStateMarkup = [
            '<script>',
            `window.__INITIAL_APP_STATE__ = ${serialize(initialState)};`,
            '</script>'
        ].join('');
        const renderedPage = template.replace(
            RGX,
            appHtmlMarkup + initialAppStateMarkup
        );

        ctx.body = renderedPage;
    });

export const ssrServer = app;
