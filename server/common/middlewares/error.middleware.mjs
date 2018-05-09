import bounder from 'koa-bouncer';
import config from '@config';
import { Exception } from '../../api-server/common/exceptions';

const isNotProduction = config.env.NODE_ENV !== 'production';

export const errorMiddleware = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Exception) {
            ctx.body = err.toObject();
            ctx.status = err.statusCode;
        } else if (err instanceof bounder.ValidationError) {
            ctx.body = err.message;
            ctx.status = 400;
        } else {
            const stackTrace = isNotProduction
                ? `Stack trace: ${err.stack}`
                : '';

            ctx.body = {
                message: [
                    `Unexpected error.`,
                    `Message: ${err.message}`,
                    stackTrace
                ].join('\r\n')
            };
            ctx.status = 500;
        }
    }
};
