import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import { configurePassport } from './configure-passport';

const app = new Koa();

configurePassport(app);

app.use(bodyParser());
app.use(routes.routes());

export const apiServer = app;
