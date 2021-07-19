const express = require('express');
const path = require('path');

const router = express.Router();

router.use((req, res, next) => {
    const controller = req.swagger['x-swagger-router-controller'];
    const operationId = req.swagger['operationId'];
    if (!controller || !operationId) {
        console.log(
            '[Error] x-swagger-router-controller and operationId must be defined on ' +
                endpoint
        );
        next();
        return;
    }
    const operation = require('./' + controller.trim())[operationId];
    if (!operation) {
        console.log(
            '[Error] Operation is Not Exist :' + controller + '.' + operationId
        );
        next();
        return;
    }
    operation(req, res);
});

module.exports = router;
