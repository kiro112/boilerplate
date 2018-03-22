'use strict';

require('app-module-path/register');

const mysql       = require('anytv-node-mysql');
const body_parser = require('body-parser');
const express     = require('express');
const winston     = require('winston');
const morgan      = require('morgan');

const config      = require('config/config');
const logger      = require('helpers/logger');

let handler;
let app;


function start () {

    // create express app
    app = express();

    // set config
    config.use(process.env.NODE_ENV);
    app.set('env', config.app.ENV);

    // configure mysql
    mysql
        .set_logger(winston)
        .add('my_db', config.database.MY_DB, true);

    winston.info('Starting', config.app.APP_NAME, 'on', config.app.ENV, 'environment');

    // configure express app
    app.set('case sensitive routing', true);
    app.set('x-powered-by', false);

    winston.verbose('Binding 3rd-party middlewares');
    app.use(morgan('combined', {stream: {write: logger.info}}));
    app.use(express.static(config.app.ASSETS_DIR));
    app.use(require('method-override')());
    app.use(body_parser.urlencoded({extended: false}));
    app.use(body_parser.json());
    app.use(require('compression')());
    app.use(require('helmet')());

    winston.verbose('Binding custom middlewares');
    app.use(require('anytv-node-cors')(config.app.CORS));
    app.use(require('lib/res_extended')());
    app.use(require('config/router')(express.Router()));
    app.use(require('anytv-node-error-handler')(winston));

    winston.info('Server listening on port', config.app.PORT);

    return app.listen(config.app.PORT);
}

handler = start();

module.exports = {
    app,
    start,
    handler
};