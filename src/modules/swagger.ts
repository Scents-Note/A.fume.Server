import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import properties from '@properties';
import { logger } from '@modules/winston';

const parseurl: any = require('parseurl');

const pathToRegexp: (
    path: string,
    keys: any[],
    options?: any
) => RegExp = require('path-to-regexp');

const localIpAddress = properties.SERVER_IP || 'localhost';

// Helper functions
function expressStylePath(_basePath: string, apiPath: string): string {
    let basePath = parseurl({ url: _basePath || '/' }).pathname || '/';

    // Make sure the base path starts with '/'
    if (basePath.charAt(0) !== '/') {
        basePath = '/' + basePath;
    }

    // Make sure the base path ends with '/'
    if (basePath.charAt(basePath.length - 1) !== '/') {
        basePath = basePath + '/';
    }

    // Make sure the api path does not start with '/' since the base path will end with '/'
    if (apiPath.charAt(0) === '/') {
        apiPath = apiPath.substring(1);
    }

    // Replace Swagger syntax for path parameters with Express' version (All Swagger path parameters are required)
    return (basePath + apiPath).replace(/{/g, ':').replace(/}/g, '');
}

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            description: '향수 정보 서비스 A.fume Server Api 문서',
            version: '0.0.1',
            title: 'Swagger A.fume Server',
            termsOfService: 'http://swagger.io/terms/',
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
        './src/controllers/*.ts',
        './src/controllers/*.js',
        './src/middleware/auth.ts',
        './api/swagger.yaml',
        './api/definitions/*.yaml',
    ],
};

const specs: SwaggerDefinition = swaggerJSDoc(options) as SwaggerDefinition;

type ApiCache = { [key: string]: any };

function initApiCache() {
    const apiCaches: { [key: string]: ApiCache } = {
        get: {},
        post: {},
        put: {},
        delete: {},
        patch: {},
    };

    return (method: string) => {
        switch (method) {
            case 'get':
                return apiCaches.get;
            case 'post':
                return apiCaches.post;
            case 'put':
                return apiCaches.put;
            case 'delete':
                return apiCaches.delete;
            case 'patch':
                return apiCaches.delete;
            default:
                logger.error('Not Implemented for ' + method);
                return () => {};
        }
    };
}

const getApiCache: (method: string) => ApiCache = initApiCache();

for (const _endpoint in specs.paths) {
    if (_endpoint[0] != '/') {
        continue;
    }
    const expressPath: string = expressStylePath(specs.basePath!!, _endpoint);

    const keys: any[] = [];
    const re: RegExp = pathToRegexp(expressPath, keys);

    const cacheKey: string = re.toString();

    for (const _method in specs.paths[_endpoint]) {
        const method = _method.toLowerCase();
        const parameters = specs.paths[_endpoint][method];
        logger.info(
            `x-security-scopes | [${method}] ${expressPath} : ${parameters['x-security-scopes']}`
        );
        const apiCache: ApiCache = getApiCache(method);
        apiCache[cacheKey] = parameters;
        apiCache[cacheKey].re = re;
    }
}

const swaggerMetadataHandler: RequestHandler = (
    req: Request | any,
    _res: Response,
    next: NextFunction
) => {
    const path: string = parseurl(req).pathname;
    const apiCache: { [key: string]: any } = getApiCache(
        req.method.toLowerCase()
    );
    const cacheKey: string = pathToRegexp(path, []).toString();
    const cacheEntry =
        apiCache[cacheKey] ||
        _.find(apiCache, function (metadata) {
            const match = metadata.re.exec(path);
            return _.isArray(match);
        });
    req.swagger = cacheEntry;
    next();
};

export { swaggerUi, specs, swaggerMetadataHandler };
