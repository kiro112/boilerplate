'use strict';

require('app-module-path/register');

const mysql       = require('anytv-node-mysql');
// const jwt         = require('jsonwebtoken');
const winston     = require('winston');

const util        = require('../helpers/util');
const config      = require('../config/config');


/**
 * @api {post} /auth    Login
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   username        User's username
 * @apiParam {String}   password        User's password
 *
 * @apiSuccessExample Sample-Response:
 * HTTP1.1/200 OK
 * {
 *    "data": {
 *        "id": "23691cd7-2d9d-11e8-a1dd-38d54711ba42",
 *        "username": "test",
 *        "isPasswordValid": 1
 *    }
 * }
 *
 * @apiErrorExample Invalid Username:
 * HTTP1.1/401 Unauthorized
 * {
 *    "code": "LOG_FAIL",
 *    "message": "Log-In failed",
 *    "context": "Invalid username"
 *
 * @apiErrorExample Incorrect password:
 * HTTP1.1/401 Unauthorized
 * {
 *    "code": "LOG_FAIL",
 *    "message": "Log-In failed",
 *    "context": "Incorrect password"
 * }
 */
exports.login = (req, res, next) => {

    const data = util.get_data({
        username:   '',
        password:   ''
    }, req.body);

    function start () {

        if (data instanceof Error) {
            return res.warn(400, { message: data.message });
        }

        let query = `
            SELECT
                id,
                username,
                IF(PASSWORD(CONCAT(MD5(?), ?)) = password, TRUE, FALSE) AS isPasswordValid
            FROM
                user
            WHERE
                username = ?
            LIMIT 1;
        `;

        let params = [
            data.password,
            config.SALT,
            data.username
        ];

        mysql.use('my_db')
            .query(
                query,
                params,
                send_response
            )
            .end();

    }

    function send_response (err, result) {
        if (err) {
            winston.error('Error to login user');
            return next(err);
        }

        if (!result.length) {
            return res.warn(401, {
                code: 'LOG_FAIL',
                message: 'Log-In failed',
                context: 'Invalid username'
            });
        }

        let user = result[0];
        if (!user.isPasswordValid) {
            return res.warn(401, {
                code: 'LOG_FAIL',
                message: 'Log-In failed',
                context: 'Incorrect password'
            });
        }

        delete user.isPasswordValid;

        res.data(user)
            .send();

    }

    start();

};