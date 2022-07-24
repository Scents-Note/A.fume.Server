import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import express, { Express } from 'express';
import createError from 'http-errors';

import properties from '@properties';

import { logger } from '@modules/winston';
import makeMorgan from '@modules/morgan';

import { HttpError } from '@errors';
import statusCode from '@utils/statusCode';
import { verifyTokenMiddleware, encryptPassword } from '@middleware/auth';
import { swaggerRouter } from '@controllers/index';
import SchedulerManager from '@schedules/index';

const {
    swaggerUi,
    specs,
    swaggerMetadataHandler,
} = require('@modules/swagger');

const sequelize: any = require('./models').sequelize;
sequelize.sync();

require('@utils/db/mongoose.js');

const app: Express = express();

app.use(cookieParser());

const allowList: string[] =
    properties.CORS_ALLOW_LIST.split(',').map((it) => {
        return it.trim();
    }) || [];

const corsOptionsDelegate: CorsOptionsDelegate<express.Request> = function (
    req: express.Request,
    callback: (err: Error | null, options?: CorsOptions) => void
) {
    const corsOptions: any = {
        origin: allowList.indexOf(req.header('Origin') || '') !== -1,
        credentials: true,
    };
    callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(express.json());

app.use(
    makeMorgan((message: string) => {
        console.log(message);
        logger.http(message);
    })
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(swaggerMetadataHandler);
app.use(specs.basePath, verifyTokenMiddleware);
app.use(specs.basePath, encryptPassword);
app.use(specs.basePath, swaggerRouter(specs));

// catch 404 and forward to error handler
app.use(
    (
        _req: express.Request,
        _res: express.Response,
        next: express.NextFunction
    ) => {
        next(createError(404));
    }
);

app.use(function (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
) {
    let status: number;
    let message: string;
    if (err instanceof HttpError || err instanceof createError.HttpError) {
        properties.NODE_ENV === 'development' && logger.error(err.stack);
        status = err.status;
        message = err.message;
    } else {
        logger.error(err);
        status = statusCode.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
    }
    res.writeHead(status, {
        'Content-Type': 'application/json',
    });
    const payload: string = JSON.stringify({ message }, null, 2);
    res.write(payload);
    res.end();
});

const scheduleManager = new SchedulerManager();
scheduleManager.start();

export default app;
