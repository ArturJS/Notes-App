// @flow
import Preact from 'preact';
import render from 'preact-render-to-string';
import _ from 'lodash';
import {
    RootComponent,
    ExposeFetchersComponent
} from '../../../build/ssr-build/ssr-bundle';

type Fetcher = {
    key: string,
    fetcher: (options: Object) => Promise<mixed>
};

const getFetchersByUrl = (url: string): Fetcher[] => {
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

const fetchInitialState = async (
    fetchers: Fetcher[],
    cookies?: string
): Promise<Object> => {
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

const addAuthState = (
    initialState: Object,
    payload: { email?: string }
): Object => {
    if (!payload.email) {
        return initialState;
    }

    return {
        ...initialState,
        auth: {
            isLoggedIn: true,
            isLoginPending: false,
            isLoginSuccess: null,
            isLogoutPending: false,
            isLogoutSuccess: null,
            authData: {
                email: payload.email
            }
        }
    };
};

class InitialStateUtils {
    async getInitialState(params: {
        url: string,
        cookies?: string,
        email?: string
    }): Promise<Object> {
        // todo: use params destructuring when
        // todo:    the issue https://github.com/codemix/flow-runtime/issues/201
        // todo:    is fixed
        const { url, cookies, email } = params;
        const fetchers = getFetchersByUrl(url);
        let initialState = await fetchInitialState(fetchers, cookies);

        initialState = addAuthState(initialState, { email });

        return initialState;
    }
}

export default new InitialStateUtils();
