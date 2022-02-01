#!/usr/bin/env node
import http from 'http';
const debug = require('debug')('swagger-test:server');

import properties from '../utils/properties';
import app from '../app';
console.log(`ENV: ${properties.NODE_ENV}`);

const localIpAddress = properties.SERVER_IP;
const port = normalizePort(properties.PORT || 8080);

const server = http.createServer(app);
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