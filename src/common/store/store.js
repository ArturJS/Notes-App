import configureStore from './configure-store';

/* eslint-disable no-underscore-dangle */
const getInitialState = () => {
    if (typeof window === 'undefined' || !window.__INITIAL_APP_STATE__) {
        return {};
    }

    const initialAppState = window.__INITIAL_APP_STATE__;

    delete window.__INITIAL_APP_STATE__;

    return initialAppState;
};
/* eslint-enable no-underscore-dangle */

const initialAppState = getInitialState();
const store = configureStore(initialAppState);

export default store;

export const getConfiguredStore = initialState => configureStore(initialState);
