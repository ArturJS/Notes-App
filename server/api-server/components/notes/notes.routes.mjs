import Router from 'koa-router';
import notesController from './notes.controller';

const router = new Router();

router
    .get('/notes', notesController.getAll)
    .get('/notes/:id', notesController.getById)
    .post('/notes', notesController.create)
    .post('/notes/reorder', notesController.reorder)
    .put('/notes/:id', notesController.update)
    .delete('/notes/:id', notesController.remove);

export default router;
