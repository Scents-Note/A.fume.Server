#!/usr/bin/env node
import http from 'http';
const debug = require('debug')('swagger-test:server');

import { logger } from '@modules/winston';

import properties from '@properties';
import app from '@src/app';
logger.info(`ENV: ${properties.NODE_ENV}`);

const localIpAddress = properties.SERVER_IP;
const port = normalizePort(properties.PORT || 8080);

const server = http.createServer(app);
server.listen(port, function () {
    logger.info(
        `Your server is listening on port ${port} (http://${localIpAddress}:${port})`
    );
    logger.info(
        `Swagger-ui is available on http://${localIpAddress}:${port}/docs`
    );
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
