'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');
const ip = require('ip');
const localIpAddress = ip.address();

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;

const dotenv = require('dotenv');
const envMap = {
  'prd': './config/.env',
  'dev': './config/.env.dev'
};

dotenv.config({path: envMap[process.env.NODE_ENV || 'dev']});
console.log(`ENV: ${process.env.NODE_ENV}`)

const { verifyTokenMiddleware } = require('./middleware/auth.js');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'dev' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
spec = spec.replace('{SERVER_URL}', localIpAddress).replace('{SERVER_PORT}', serverPort);
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());
  
  // Provide the security handlers
  app.use(middleware.swaggerSecurity({
    userToken: verifyTokenMiddleware
  }));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // error handler
  app.use(function(err, req, res, next) {
    // only providing error in development
    err = process.env.NODE_ENV === 'dev' ? (() => {console.log(err); return err;})() : new Error('Internal Server Error');

    res.writeHead(err.status || 500, {'Content-Type': 'application/json'});
    const payload = JSON.stringify({ message: err.message }, null, 2);
    res.write(payload);
    res.end();
  });

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://%s:%d)', serverPort, localIpAddress, serverPort);
    console.log('Swagger-ui is available on http://%s:%d/docs', localIpAddress, serverPort);
  });
});
