'use strict';

const importer = require('anytv-node-importer');
const logger = require('../lib/log');

module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;


    router.get('/user/:id',     logger,         __.user.get_user);
    router.post('/user/:id',    logger,         __.user.get_user);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
