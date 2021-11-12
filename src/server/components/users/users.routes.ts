import Router from 'koa-router';
import { withAuth } from '~/server/common/middlewares';
import usersApiValidator from './users.api-validator';
import usersController from './users.controller';

const router = new Router();

router
    .get('/users', withAuth, usersController.getAll)
    .get(
        '/users/:email',
        withAuth,
        usersApiValidator.getByEmail,
        usersController.getByEmail
    )
    .post('/users', withAuth, usersApiValidator.create, usersController.create)
    .get('/user', withAuth, usersController.getUserData);

export default router;
