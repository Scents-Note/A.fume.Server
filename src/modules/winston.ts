import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

import properties from '../utils/properties';

const logDir: string = 'logs/info';
const httpDir: string = 'logs/http';
const errorDir: string = 'logs/error';
const { combine, timestamp, printf, colorize, simple } = winston.format;

const logFormat: winston.Logform.Format = printf(
    (info: winston.Logform.TransformableInfo) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    }
);

function makeLogger(): winston.Logger {
    if (properties.NODE_ENV == 'test') {
        return winston.createLogger({
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

    /*
     * Log Level
     * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
     */
    const logger: winston.Logger = winston.createLogger({
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            logFormat
        ),
        transports: [
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
                level: 'error',
                datePattern: 'YYYY-MM-DD',
                dirname: errorDir,
                filename: `%DATE%.error.log`,
                maxFiles: 30,
                zippedArchive: true,
            }),
        ],
    });
    if (process.env.NODE_ENV !== 'production') {
        logger.add(
            new winston.transports.Console({
                format: combine(colorize(), simple()),
            })
        );
    }
    return logger;
}

const logger: winston.Logger = makeLogger();

export { logger };
