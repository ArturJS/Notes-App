import { Exception } from '../exceptions';

export const errorMiddleware = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Exception) {
            ctx.body = err.toObject();
            ctx.status = err.statusCode;
        } else {
            ctx.body = { message: `Unexpected error. ${err.stack}` };
            ctx.status = 500;
        }
    }
};
