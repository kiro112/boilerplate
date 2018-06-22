'use strict';

const mysql   = require('anytv-node-mysql');
const logger = require('../helpers/logger');

/**
 * @api {get} /user/:id Get user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} user_id User's unique ID
 * @apiSuccess {String} date_created Time when the user was created
 * @apiSuccess {String} date_updated Time when last update occurred
 */
exports.get_user = function (req, res, next) {

    console.log('get user ~~~~ ');

    // res.data({ message: 'test12' }).send();
    res.send({ message: 'resp ~' });
};
