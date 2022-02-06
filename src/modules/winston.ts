import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

import properties from '../utils/properties';

const errorDir: string = 'logs/error';
const logDir: string = 'logs/info';
const httpDir: string = 'logs/http';
const debugDir: string = 'logs/debug';
const { combine, timestamp, printf, colorize, simple } = winston.format;

const logFormat: winston.Logform.Format = printf(
    (info: winston.Logform.TransformableInfo) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    }
);

function truncate(input: string, limit: number) {
    return input.length > limit ? `${input.substring(0, limit)}...` : input;
}
interface ILoggerAdapter {
    logger: winston.Logger;
    infoWithTruncate(message: string): void;
}
const LIMIT_LOG_MESSAGE_LENGTH: number = 500;
class LoggerAdapter implements ILoggerAdapter {
    logger: winston.Logger;
    constructor() {
        /*
         * Log Level
         * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
         */
        this.logger = winston.createLogger({
            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                logFormat
            ),
            transports: [
                new winstonDaily({
                    level: 'error',
                    datePattern: 'YYYY-MM-DD',
                    dirname: errorDir,
                    filename: `%DATE%.error.log`,
                    maxFiles: 30,
                    zippedArchive: true,
                }),
                new winstonDaily({
                    level: 'info',
                    datePattern: 'YYYY-MM-DD',
                    dirname: logDir,
                    filename: `%DATE%.log`,
                    maxFiles: 14,
                    zippedArchive: true,
                }),
                new winstonDaily({
                    level: 'http',
                    datePattern: 'YYYY-MM-DD',
                    dirname: httpDir,
                    filename: `%DATE%.http.log`,
                    maxFiles: 7,
                    zippedArchive: true,
                }),
                new winstonDaily({
                    level: 'debug',
                    datePattern: 'YYYY-MM-DD',
                    dirname: debugDir,
                    filename: `%DATE%.debug.log`,
                    maxFiles: 1,
                    zippedArchive: true,
                }),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new winston.transports.Console({
                    format: combine(colorize(), simple()),
                })
            );
        }
    }

    public infoWithTruncate(message: string): void {
        logger.info(truncate(message, LIMIT_LOG_MESSAGE_LENGTH));
    }
}

class TestLoggerAdapter implements ILoggerAdapter {
    logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger({
            level: 'debug',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                colorize(),
                printf(
                    ({ level, message, label, timestamp }) =>
                        `${timestamp} ${label || '-'} ${level}: ${message}`
                )
            ),
            transports: [
                new winston.transports.Stream({
                    stream: process.stderr,
                    level: 'debug',
                }),
            ],
        });
    }

    public infoWithTruncate(message: string): void {
        logger.info(message);
    }
}
function createLoggerAdapter(): ILoggerAdapter {
    if (properties.NODE_ENV == 'test') {
        return new TestLoggerAdapter();
    }
    return new LoggerAdapter();
}

const loggerAdapter: ILoggerAdapter = createLoggerAdapter();
const logger: winston.Logger = loggerAdapter.logger;

export { ILoggerAdapter, logger, loggerAdapter };
