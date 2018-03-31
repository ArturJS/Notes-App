import Router from 'koa-router';
import { notesRoutes } from './components/notes';

const router = new Router();

router.use(notesRoutes.routes(), notesRoutes.allowedMethods());

export default router;
