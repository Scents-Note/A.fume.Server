const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const express = require('express');
const { default: properties } = require('../utils/properties');

const localIpAddress = properties.SERVER_IP || 'localhost';

const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Test API',
            version: '0.0.1',
            description: '향수 정보 서비스 A.fume Server Api 문서',
            version: '0.0.1',
            title: 'Swagger A.fume Server',
            termsOfService: 'http://swagger.io/terms/',
            contact: '',
            email: 'heesung6701@naver.com',
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        host: `${localIpAddress}:${properties.PORT}`,
        basePath: '/A.fume/api/0.0.1',
    },
    apis: [
        './src/controllers/*.js',
        './src/modules/swagger/*',
        './api/swagger.yaml',
        './api/endpoints/*.yaml',
        './api/definitions/*.yaml',
    ],
};

const specs = swaggerJsdoc(options);

const swaggerRouter = express.Router();
for (const _endpoint in specs.paths) {
    if (_endpoint[0] != '/') {
        continue;
    }
    const endpoint = _endpoint.replace(/{/g, ':').replace(/}/g, '');
    for (const method in specs.paths[_endpoint]) {
        const parameters = specs.paths[_endpoint][method];
        console.log(
            `x-security-scopes | [${method}] ${endpoint} : ${parameters['x-security-scopes']}`
        );
        swaggerRouter[method].call(
            swaggerRouter,
            endpoint,
            (req, res, next) => {
                req.swagger = parameters;
                req.next();
            }
        );
    }
}

module.exports = {
    swaggerUi,
    specs,
    swaggerRouter,
};
