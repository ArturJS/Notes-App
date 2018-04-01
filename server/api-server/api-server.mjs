import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import { configurePassport } from './configure-passport';

const app = new Koa();

app.use(bodyParser());

configurePassport(app);

app.use(routes.routes());

export const apiServer = app;
