import Router from 'koa-router';
import usersController from './users.controller';

const router = new Router();

router
    .get('/users', usersController.getAll)
    .get('/users/:email', usersController.getByEmail)
    .post('/users', usersController.create);

export default router;
