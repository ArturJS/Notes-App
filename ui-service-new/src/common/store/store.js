import _ from 'lodash';
import configureStore from './configure-store';

/* eslint-disable no-underscore-dangle */
const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {};
    }

    const initialAppState = _.get(
        window,
        '__NEXT_DATA__.props.pageProps.__INITIAL_REDUX_STATE__'
    );

    delete window.__NEXT_DATA__.props;

    return initialAppState;
};
/* eslint-enable no-underscore-dangle */

const initialAppState = getInitialState();
const store = configureStore(initialAppState);

export default store;

export const getConfiguredStore = initialState => configureStore(initialState);
