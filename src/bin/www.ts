#!/usr/bin/env node

/**
 * Module dependencies.
 */

import properties from '../utils/properties';
import http from 'http';

console.log(`ENV: ${properties.NODE_ENV}`);

const app: any = require('../app');
const debug: any = require('debug')('swagger-test:server');

/**
 * Get port from environment and store in Express.
 */

const port: any = normalizePort(properties.PORT || '8080');

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

const localIpAddress: string = properties.SERVER_IP;

server.listen(port, function () {
    console.log(
        'Your server is listening on port %d (http://%s:%d)',
        port,
        localIpAddress,
        port
    );
    console.log(
        'Swagger-ui is available on http://%s:%d/docs',
        localIpAddress,
        port
    );
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): any {
    var port: number = parseInt(val, 10);

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

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind: string =
        typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
    var addr: any = server.address();
    var bind: any =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
