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
            full_name: req.user ? req.user.firstName + ' ' + req.user.lastName : 'GUEST',
            method: req.method,
            url: req.url,
            headers: JSON.stringify(req.headers),
            req_query: JSON.stringify(req.query),
            req_params: JSON.stringify(req.params),
            req_body: JSON.stringify(body),
            ip: req.ip
        };

        mysql.use('db_name')
            .query(
                `INSERT INTO log SET ?`,
                [ user ],
                check_errors
            )
            .end();
    }



    function check_errors(err, result, args, last_query) {
        const   oldWrite = res.write,
                oldEnd = res.end,
                chunks = [];

        user.id = result.insertId;

        if(err){
            return winston.error('Cannot insert log', last_query, err);
        }

        res.write = (chunk) => {
            chunks.push(chunk);
            oldWrite.apply(res, arguments);
        };


        res.end = (chunk) => {
            console.log('res.end');
            if (chunk) {
                chunks.push(chunk);
            }

            const body = Buffer.concat(chunks).toString('utf8');

            oldEnd.apply(res, arguments);
            user.res_body = body;
            set_response_body();
            console.log('res.end');
            return next();
        };

    }

    function set_response_body() {
        if (!updated) {
            updated = true;
            mysql.use('db_name')
                .query(
                    `UPDATE log SET res_body = ? WHERE id = ?`,
                    [ user.res_body, user.id ],
                    send_response
                )
                .end();
        }

        console.log('next ~');
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            return winston.error(`Error in creating log: ${last_query}`);
        }
    }

    start ();

};
