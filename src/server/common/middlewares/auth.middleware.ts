import { ErrorNotAuthorized } from '../exceptions/index';

export const withAuth = (ctx, next) => {
    if (ctx.isAuthenticated()) {
        return next();
    }

    throw new ErrorNotAuthorized();
};
