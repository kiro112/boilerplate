'use strict';

const config = require('../config/config').database.redis;
const client = redis.createClient(config);

module.exports = client;
