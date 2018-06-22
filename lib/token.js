'use strict';

const jwt = require('jsonwebtoken');

const redis = require('redis');
const config = require('../config/config');


exports.verify = (req, res, next) => {
    const token = req.headers['x-access-token'];

    let decrypted;
    let userId;

    function start () {

        if (!token) {
            return res.error('MISSING_AUTH_TOKEN');
        }

        jwt.verify(
            token,
            config.SECRET,
            {algorithms : [config.TOKEN_ALGO]},
            verify_token
        );
    }

    function verify_token (err, user) {

        if (err) {
            return res.error('AUTH_FAILED');
        }

        decrypted = crypto.decryptSync(user.user);
        userId    = decrypted.tokenId;

        redis.sismember(userId, token, send_response);
    }

    function send_response (redis_err, isMember) {

        if (redis_err || !isMember || (typeof isMember === 'string' && isMember !== token) ) {
            return res.error('AUTH_FAILED');
        }

        req.user = decrypted;

        next();
    }

    start();
};
