import { ErrorNotAuthorized } from '../exceptions/index';

export const withAuth = (ctx, next) => {
    // console.log({
    //     withAuthCtx: ctx,
    //     'ctx.isAuthenticated': ctx.isAuthenticated,
    //     'ctx.req.isAuthenticated': ctx.req.isAuthenticated
    // })

    if (ctx.isAuthenticated()) {
        return next();
    }

    throw new ErrorNotAuthorized();
};
