import Router from 'koa-router';
import { notesRoutes } from './components/notes';
import { usersRoutes } from './components/users';
import { filesRoutes } from './components/files';

const router = new Router({
    prefix: '/api'
});

router
    .use(notesRoutes.routes(), notesRoutes.allowedMethods())
    .use(usersRoutes.routes(), usersRoutes.allowedMethods())
    .use(filesRoutes.routes(), filesRoutes.allowedMethods());

export default router;
