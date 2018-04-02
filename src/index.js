import 'regenerator-runtime/runtime';
import App from './common/components/app';
import { ExposeFetchers } from './common/features/ssr-fetcher';
import { getConfiguredStore } from './common/store';
import './common/style/index.scss';

if (typeof window !== 'undefined') {
    import('smoothscroll-polyfill');
}

export default App;

export const RootComponent = App;

export const ExposeFetchersComponent = ExposeFetchers;

export const configureStore = getConfiguredStore;
