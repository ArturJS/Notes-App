import Koa from 'koa';
import mount from 'koa-mount';
import { ssrServer } from './ssr-server';
import { apiServer } from './api-server';

const app = new Koa();
const { PORT = 3000 } = process.env;

app
    .use(mount('/api', apiServer))
    .use(mount('/', ssrServer))
    .listen(PORT, () => {
        console.log(`Server is listening ${PORT} port`);
    });
