import winston from 'winston';
import config from '~/server/common/config';
import { asyncLocalStorage } from '~/server/common/middlewares';

const baseLogger = winston.createLogger({
    level: config.logger.LOG_LEVEL,
    transports: [
        new winston.transports.Console()
    ]
});

type TAsyncStore = {
    ip: string;
    traceId: string;
};

const withRequestInfo = (wrappedFn) => (message: string, ...args) => {
    const { ip, traceId } = (asyncLocalStorage.getStore() ?? {}) as TAsyncStore;
    const extendedMessage = `[ip: ${ip}] [traceId: ${traceId}] ${message}`;

    wrappedFn(extendedMessage, ...args);
};

const logger = {
    info: withRequestInfo(baseLogger.info),
    warn: withRequestInfo(baseLogger.warn),
    error: withRequestInfo(baseLogger.error)
}

export default logger;
