const express = require('express');
const path = require('path');

module.exports = (specs) => {
    const router = express.Router();
    for (const endpoint in specs.paths) {
        for (const method in specs.paths[endpoint]) {
            const parameter = specs.paths[endpoint][method];
            const controller = parameter['x-swagger-router-controller'];
            const operationId = parameter['operationId'];
            if (!controller || !operationId) {
                console.log(
                    '[Error] x-swagger-router-controller and operationId must be defined on ' +
                        endpoint
                );
                continue;
            }
            const operation = require('./' + controller.trim())[operationId];
            if (!operation) {
                console.log(
                    '[Error] Operation is Not Exist :' +
                        controller +
                        '.' +
                        operationId
                );
                continue;
            }
            router[method](endpoint, operation);
        }
    }

    return router;
};
