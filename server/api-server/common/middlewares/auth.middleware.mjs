import { ErrorNotAuthorized } from '../exceptions';

export const withAuth = (ctx, next) => {
    if (ctx.isAuthenticated()) {
        return next();
    }

    throw new ErrorNotAuthorized();
};
