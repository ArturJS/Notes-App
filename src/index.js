import 'regenerator-runtime/runtime';
import App from './common/components/app';
import './common/style/index.scss';

if (typeof window !== 'undefined') {
    import('smoothscroll-polyfill');
}

export default App;
