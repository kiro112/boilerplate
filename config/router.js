'use strict';

const importer = require('anytv-node-importer');
const logger = require('../lib/log');

module.exports = (router) => {
    const __ = importer.dirloadSync('../controllers');

    router.del = router.delete;

    router.all('*', logger);

    router.get('/user/:id', __.user.get_user);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
