import config from '~/server/common/config';
import { Exception } from '~/server/common/exceptions';
import logger from '~/server/common/logger';

const isNotProduction = config.env.NODE_ENV !== 'production';

export const errorMiddleware = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Exception) {
            ctx.body = err.toObject();
            ctx.status = err.statusCode;

            logger.warn(
                `Common exception. ${JSON.stringify(ctx.body, null, '  ')}`
            );
        } else {
            const stackTrace = isNotProduction
                ? `Stack trace: ${err.stack}`
                : '';

            logger.error(`Unexpected error. ${err.message} ${err.stack}`);

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
