import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import express, { Express } from 'express';
import createError from 'http-errors';

import properties from './utils/properties';

import { HttpError } from './utils/errors/errors';
import statusCode from './utils/statusCode';
import { verifyTokenMiddleware } from './middleware/auth';

const { swaggerUi, specs, swaggerMetadata } = require('./modules/swagger');

const app: Express = express();

const sequelize: any = require('./models').sequelize;
sequelize.sync();

app.use(cookieParser());

require('./utils/db/mongoose.js');

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(
    specs.basePath,
    (
        req: express.Request,
        _res: express.Response,
        next: express.NextFunction
    ) => {
        console.log(req.url);
        next();
    }
);
app.use(swaggerMetadata);
app.use(specs.basePath, verifyTokenMiddleware);
app.use(specs.basePath, require('./controllers/index')(specs));

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
        properties.NODE_ENV === 'development' && console.log(err.stack);
        status = err.status;
        message = err.message;
    } else {
        console.log(err);
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

require('./lib/cron.js');

export default app;
