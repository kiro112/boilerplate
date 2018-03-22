'use strict';

const importer = require('anytv-node-importer');

module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;


    router.post('/auth',    __.auth.login);



    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
