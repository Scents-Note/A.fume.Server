const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const { swaggerUi, specs } = require('./modules/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(require('./controllers/index.js')(specs));
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    if (!err.status || err.status >= 500) {
        process.env.NODE_ENV === 'development' && console.log(err);
        process.env.NODE_ENV === 'production' &&
            (() => {
                err = new Error('Internal Server Error');
            })();
    }

    res.writeHead(err.status || 500, {
        'Content-Type': 'application/json',
    });
    const payload = JSON.stringify({ message: err.message }, null, 2);
    res.write(payload);
    res.end();
});

module.exports = app;