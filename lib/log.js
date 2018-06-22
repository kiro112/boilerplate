'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('../helpers/logger');
const _ = require('lodash');

module.exports = (req, res, next) => {

    let user;
    let updated;

    function start () {

        let body = _.clone(req.body);

        user = {
            user_id: req.user ? req.user.id : 'GUEST',
            full_name: req.user ? (req.user.firstName + ' ' + req.user.lastName) : 'GUEST',
            method: req.method,
            url: req.url,
            headers: JSON.stringify(req.headers),
            req_query: JSON.stringify(req.query),
            req_params: JSON.stringify(req.params),
            req_body: JSON.stringify(body),
            ip: req.ip
        };

        console.log('log starts !');
        mysql.use('cdi_db')
            .query(
                `INSERT INTO log SET ?`,
                [ user ],
                check_errors
            )
            .end();
    }

    function check_errors (err, result, args, last_query) {

        const oldWrite = res.write,
              oldEnd = res.end,
              chunks = [];


        console.log('check error');
        console.log(err);
        if (err) {
            return winston.error('Cannot insert log', last_query, err);
        }

        user.id = result.insertId;

        res.write = (chunk) => {
            console.log('res.write ~');
            chunks.push(chunk);
            oldWrite.apply(res, arguments);
        };

        res.end = (chunk) => {
            if (chunk) {
                chunks.push(chunk);
            }

            console.log('res.end ~');
            const body = Buffer.concat(chunks).toString('utf8');

            oldEnd.apply(res, arguments);
            user.res_body = body;

            set_response_body();
        };

        next();

    }

    function set_response_body () {
        console.log('updated !', updated);
        if (!updated) {
            updated = true;
            mysql.use('cdi_db')
                .query(
                    `UPDATE log SET res_body = ? WHERE id = ?`,
                    [ user.res_body, user.id ],
                    send_response
                )
                .end();
        }
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            return winston.error(`Error in creating log: ${last_query}`);
        }

        console.log('log send response ~');
    }

    start ();

};
