const express = require('express');

module.exports = (specs) => {
    const router = express.Router();

    for (const _endpoint in specs.paths) {
        if (_endpoint[0] != '/') {
            continue;
        }
        const endpoint = _endpoint.replace(/{/g, ':').replace(/}/g, '');
        for (const method in specs.paths[_endpoint]) {
            const parameter = specs.paths[_endpoint][method];
            const controller = parameter['x-swagger-router-controller'];
            const operationId = parameter.operationId;
            if (!controller || !operationId) continue;
            const controllerPath = './' + controller.trim();
            const operation = require(controllerPath)[operationId];
            if (!operation) {
                console.log(
                    '[Error] Operation is Not Exist :' +
                        controller +
                        '.' +
                        operationId
                );
                continue;
            }
            console.log(
                `route [${method}] ${endpoint} : ${controller}.${operationId}`
            );
            router[method](endpoint, operation);
        }
    }

    return router;
};
