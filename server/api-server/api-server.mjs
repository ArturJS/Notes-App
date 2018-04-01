import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorMiddleware } from './common/middlewares';
import routes from './routes';
import { configurePassport } from './configure-passport';

const app = new Koa();

app.use(bodyParser());
app.use(errorMiddleware);

configurePassport(app);

app.use(routes.routes());

export const apiServer = app;
