import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';

const app = new Koa();

app.use(bodyParser());
app.use(routes.routes());

export const apiServer = app;
