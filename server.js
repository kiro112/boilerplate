'use strict';

require('app-module-path/register');

const mysql = require('anytv-node-mysql');
const body_parser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const logger = require('helpers/logger');
const config = require('config/config');

let handler;
let app;



function start () {

    if (handler) {
        handler.close();
    }

    // create express app
    app = express();

    // set config
    config.use(process.env.NODE_ENV);
    app.set('env', config.app.ENV);
    app.set('trust proxy', 1);

    // configure mysql
    mysql.set_logger(logger)
        .add('cdi_db', config.database.cdi_db, true);

    // configure express app
    app.set('case sensitive routing', true);
    app.set('x-powered-by', false);

    logger.verbose('Binding 3rd-party middlewares');
    app.use(morgan('combined', {stream: {write: logger.info}}));
    app.use(require('helmet')());
    app.use(express.static(config.app.ASSETS_DIR));
    app.use(require('method-override')());
    app.use(body_parser.urlencoded({extended: false}));
    app.use(body_parser.json());
    app.use(require('compression')());


    logger.verbose('Binding custom middlewares');
    app.use(require('anytv-node-cors')(config.app.CORS));
    app.use(require('lib/res_extended')());
    app.use(require('config/router')(
        express.Router({
            caseSensitive: true,
            strict: true
        })
    ));
    app.use(require('anytv-node-error-handler')(logger));

    logger.info(`Server listening on port ${config.app.PORT}`);

    return app.listen(config.app.PORT);
}

handler = start();

module.exports = {
    app,
    start,
    handler
};
