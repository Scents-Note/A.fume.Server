const { Router } = require('express');
const route = Router();

module.exports = (app) => {
    app.use('/', route);
    route.get('/',
        (req, res, next) => {
            throw Error('This Method is Not Implemented');
        });
    route.post('/',
        (req, res, next) => {
            throw Error('This Method is Not Implemented');
        });
    route.post('/',
        (req, res, next) => {
            throw Error('This Method is Not Implemented');
        });
};