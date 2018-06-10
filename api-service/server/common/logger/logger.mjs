import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '@config';

const logger = winston.createLogger({
    level: config.logger.LOG_LEVEL,
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            dirname: path.resolve(__dirname, '../../../logs'),
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

export default logger;
