import Router from 'koa-router';
import usersController from './users.controller';

const router = new Router();

router
    .get('/users', notesController.getAll)
    .get('/notes/:id', notesController.getById)
    .post('/notes', notesController.create)
    .put('/notes/:id', notesController.update)
    .delete('/notes/:id', notesController.remove);

export default router;
