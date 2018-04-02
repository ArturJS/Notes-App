import configureStore from './configure-store';

const store = configureStore();

export default store;

export const getConfiguredStore = initialState => configureStore(initialState);
