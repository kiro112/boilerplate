'use strict';

const crypto = require('crypto');
const config = require('../config/config');

exports.encrypt = (data, callback) => {
    const cipher = crypto.createCipher(config.ENCRYPT, config.SALT);
    let encrypted;

    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }

    encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    callback(encrypted);
};

exports.decrypt = (data, callback) => {
    const decipher = crypto.createDecipher(config.ENCRYPT, config.SALT);
    let decrypted  = decipher.update(data, 'hex', 'utf8');
    decrypted     += decipher.final('utf8');

    try {
        decrypted = JSON.parse(decrypted);
    } catch (e) {}

    callback(decrypted);
};

exports.encryptSync = data => {

    switch (typeof data) {
        case 'object':
            data = JSON.stringify(data);
            break;

        case 'number':
            data = data.toString();
            break;

        case 'string':
            break;

        default:
            throw new TypeError('data must be Object or Number');
    }

    const cipher    = crypto.createCipher(config.ENCRYPT, config.SALT);
    let encrypted   = cipher.update(data, 'utf8', 'hex');
        encrypted  += cipher.final('hex');

    return encrypted;
};

exports.decryptSync = (data) => {
    const decipher = crypto.createDecipher(config.ENCRYPT, config.SALT);
    let decrypted  = decipher.update(data, 'hex', 'utf8');
    decrypted     += decipher.final('utf8');

    try {
        decrypted  = JSON.parse(decrypted);
    } catch (e) {
        if (!isNaN(decrypted)) {
            decrypted = parseInt(decrypted, 10);
        }
    }

    return decrypted;
};
