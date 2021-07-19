const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const localIpAddress = process.env.SERVER_IP || 'localhost';
const port = process.env.PORT || 3000;
const version = process.env.version || '0.0.1';
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
            schemes: ['http'],
            security: ['userToken'],
        },
        host: `${localIpAddress}:${port}`,
        basePath: `/A.fume/api/${version}`,
        externalDocs: {
            description: 'Afume Server Git Wiki',
            url: 'https://github.com/A-fume/A.fume.Server/wiki',
        },
    },
    apis: [
        './swagger/*',
        './api/swagger.yaml',
        './api/endpoints/*.yaml',
        './api/definitions/*.yaml',
    ],
};

console.log(`Swagger host is ${localIpAddress}:${process.env.PORT}`);
const specs = swaggerJsdoc(options);

const express = require('express');

const swaggerRouter = express.Router();
for (const _endpoint in specs.paths) {
    const endpoint = _endpoint.replace(/{/g, ':').replace(/}/g, '');
    for (const method in specs.paths[_endpoint]) {
        const parameter = specs.paths[_endpoint][method];
        swaggerRouter[method](endpoint, (req, res, next) => {
            req.swagger = parameter;
            req.swagger.params = {};
            for (const key in req.params) {
                req.swagger.params[key] = { value: req.params[key] };
            }
            req.swagger.params['body'] = { value: req.body };
            next();
        });
    }
}

module.exports = {
    swaggerUi,
    specs,
    swaggerRouter,
};
