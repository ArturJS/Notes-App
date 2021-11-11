import Router from 'koa-router';
import { withAuth } from '@root/common/middlewares/auth.middleware';
import notesApiValidator from './notes.api-validator';
import notesController from './notes.controller';

const router = new Router();

router
    .get('/notes', withAuth, notesController.getAll)
    .get(
        '/notes/:id',
        withAuth,
        notesApiValidator.getById,
        notesController.getById
    )
    .post('/notes', withAuth, notesApiValidator.create, notesController.create)
    .post(
        '/notes/reorder',
        withAuth,
        notesApiValidator.reorder,
        notesController.reorder
    )
    .put('/notes', withAuth, notesApiValidator.update, notesController.update)
    .delete(
        '/notes/:id',
        withAuth,
        notesApiValidator.remove,
        notesController.remove
    );

export default router;
