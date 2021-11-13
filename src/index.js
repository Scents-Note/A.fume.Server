import dotenv from 'dotenv';
dotenv.config();

import { HttpError } from './utils/errors/errors';
import { INTERNAL_SERVER_ERROR } from './utils/statusCode';

const fs = require('fs'),
    path = require('path'),
    http = require('http');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const serverPort = process.env.PORT || 8080;

const app = express();

console.log(`ENV: ${process.env.NODE_ENV}`);

const sequelize = require('./models').sequelize;
sequelize.sync();

app.use(cookieParser());

require('./utils/db/mongoose.js');

const allowList = process.env.CORS_ALLOW_LIST.split(',').map((it) => {
    return it.trim();
});
const corsOptionsDelegate = function (req, callback) {
    const corsOptions = {
        origin: allowList.indexOf(req.header('Origin')) !== -1,
        credentials: true,
    };
    callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

const localIpAddress = process.env.SERVER_IP || 'localhost';

const { verifyTokenMiddleware } = require('./middleware/auth.js');

// swaggerRouter configuration
var options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'dev', // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
let spec = fs.readFileSync(path.join(__dirname, '../api/swagger.yaml'), 'utf8');
spec = spec
    .replace('{SERVER_URL}', localIpAddress)
    .replace('{SERVER_PORT}', serverPort);
const swaggerDoc = jsyaml.load(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Provide the security handlers
    app.use(
        middleware.swaggerSecurity({
            userToken: verifyTokenMiddleware,
        })
    );

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // error handler
    app.use(function (err, req, res, next) {
        let status;
        let message;
        if (err instanceof HttpError) {
            process.env.NODE_ENV === 'development' && console.log(err.stack);
            status = err.status;
            message = err.message;
        } else {
            console.log(err);
            status = INTERNAL_SERVER_ERROR;
            message = 'Internal Server Error';
        }
        res.writeHead(status, {
            'Content-Type': 'application/json',
        });
        const payload = JSON.stringify({ message }, null, 2);
        res.write(payload);
        res.end();
    });

    // Start the server
    http.createServer(app).listen(serverPort, function () {
        console.log(
            'Your server is listening on port %d (http://%s:%d)',
            serverPort,
            localIpAddress,
            serverPort
        );
        console.log(
            'Swagger-ui is available on http://%s:%d/docs',
            localIpAddress,
            serverPort
        );
    });
});

require('./lib/cron.js');

module.exports = app;
