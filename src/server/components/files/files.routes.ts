import Router from 'koa-router';
import { withAuth } from '@root/common/middlewares/auth.middleware';
import filesApiValidator from './files.api-validator';
import filesController from './files.controller';

const router = new Router();

router
    .get('/files', withAuth, filesController.getAll)
    .get(
        '/files/:id',
        withAuth,
        filesApiValidator.getById,
        filesController.getById
    )
    .post('/files', withAuth, filesController.create)
    .delete(
        '/files/:id',
        withAuth,
        filesApiValidator.remove,
        filesController.remove
    );

export default router;
