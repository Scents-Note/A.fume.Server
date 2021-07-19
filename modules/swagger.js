const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const localIpAddress = process.env.SERVER_IP || 'localhost';

const options = {
    swaggerDefinition: {
        openapi: '3.0.2',
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
        host: `${localIpAddress}:${process.env.PORT}`,
        basePath: '/A.fume/api/0.0.1',
    },
    apis: [
        './controllers/*.js',
        './swagger/*',
        './api/swagger.yaml',
        './api/endpoints/*.yaml',
        './api/definitions/*.yaml',
    ],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
