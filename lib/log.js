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
            id: uuid.v4(),
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

        mysql.use('express')
            .query(
                `INSERT INTO log SET ?`,
                [ user ],
                check_errors
            )
            .end();
    }

    function check_errors(err, result, args, last_query) {

        next();

        if(err){
            return winston.error('Cannot insert log', last_query, err);
        }

        //handle res.send
        const   oldWrite = res.write,
                oldEnd = res.end,
                chunks = [];

        res.write = function (chunk) {
            chunks.push(chunk);
            oldWrite.apply(res, arguments);
        };


        res.end = function (chunk) {
            if (chunk) {
                chunks.push(chunk);
            }

            const body = Buffer.concat(chunks).toString('utf8');

            oldEnd.apply(res, arguments);
            user.resBody = body;

            set_response_body();
        };

    }

    function set_response_body() {
        if(!updated){
            updated = true;
            mysql.use('express')
                .query(
                    `UPDATE log SET res_body = ? WHERE id = ?`,
                    [ user.resBody, user.id ],
                    send_response
                )
                .end();
        }
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            return winston.error(`Error in creating log: ${last_query}`);
        }
    }

    start ();

};
