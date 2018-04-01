import Router from 'koa-router';
import { withAuth } from '../../common/middlewares';
import usersController from './users.controller';

const router = new Router();

router
    .get('/users', withAuth, usersController.getAll)
    .get('/users/:email', withAuth, usersController.getByEmail)
    .post('/users', withAuth, usersController.create);

export default router;
