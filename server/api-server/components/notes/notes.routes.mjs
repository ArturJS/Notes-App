import Router from 'koa-router';
import { withAuth } from '../../common/middlewares/auth.middleware';
import noteApiValidator from './notes.api-validator';
import notesController from './notes.controller';

const router = new Router();

router
    .get('/notes', withAuth, notesController.getAll)
    .get(
        '/notes/:id',
        withAuth,
        noteApiValidator.getById,
        notesController.getById
    )
    .post('/notes', withAuth, notesController.create)
    .post('/notes/reorder', withAuth, notesController.reorder)
    .put('/notes', withAuth, notesController.update)
    .delete('/notes/:id', withAuth, notesController.remove);

export default router;
