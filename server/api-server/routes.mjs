import Router from 'koa-router';
import { notesRoutes } from './components/notes';
import { usersRoutes } from './components/users';

const router = new Router();

router
    .use(notesRoutes.routes(), notesRoutes.allowedMethods())
    .use(usersRoutes.routes(), usersRoutes.allowedMethods());

export default router;
