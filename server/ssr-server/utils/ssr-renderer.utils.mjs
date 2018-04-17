// @flow
import fs from 'fs';
import path from 'path';
import Preact from 'preact';
import render from 'preact-render-to-string';
import serialize from 'serialize-javascript';
import {
    RootComponent,
    configureStore
} from '../../../build/ssr-build/ssr-bundle';

const RGX = /<div id="app"[^>]*>.*?(?=<script)/i;
const template = fs.readFileSync(
    path.resolve(__dirname, '../../../build/index.html'),
    'utf8'
);

class SsrRendererUtils {
    renderPage(params: Object): string {
        const {
            initialState,
            url
        }: { initialState: Object, url: string } = params;
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

        return renderedPage;
    }
}

export default new SsrRendererUtils();
