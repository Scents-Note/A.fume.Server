import express, { RequestHandler } from 'express';
import { SwaggerDefinition } from 'swagger-jsdoc';

function swaggerRouter(specs: SwaggerDefinition) {
    const router: any = express.Router();

    for (const _endpoint in specs.paths) {
        if (_endpoint[0] != '/') {
            continue;
        }
        const endpoint: string = _endpoint.replace(/{/g, ':').replace(/}/g, '');
        for (const method in specs.paths[_endpoint]) {
            const parameter: {
                'x-swagger-router-controller': string;
                operationId: string;
            } = specs.paths[_endpoint][method];
            const controller = parameter['x-swagger-router-controller'];
            const operationId = parameter.operationId;
            if (!controller || !operationId) continue;
            const controllerPath: string = './' + controller.trim();
            const operation: RequestHandler =
                require(controllerPath)[operationId];
            if (!operation) {
                console.log(
                    '[Error] Operation is Not Exist :' +
                        controller +
                        '.' +
                        operationId
                );
                continue;
            }
            // TODO 해당 정보는 파일로 로깅하기
            // console.log(
            //     `route [${method}] ${endpoint} : ${controller}.${operationId}`
            // );
            router[method](endpoint, operation);
        }
    }

    return router;
}

export { swaggerRouter };
