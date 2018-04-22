import Router from 'koa-router';
import { withAuth } from '../../common/middlewares/auth.middleware';
import filesController from './files.controller';

const router = new Router();

router
    .get('/files', withAuth, filesController.getAll)
    .get('/files/:id', withAuth, filesController.getById)
    .post('/files', withAuth, filesController.create)
    .delete('/files/:id', withAuth, filesController.remove);

export default router;
