import path from 'path';
import winston from 'winston';
import config from '@config';

const logger = winston.createLogger({
    level: config.logger.LOG_LEVEL,
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
