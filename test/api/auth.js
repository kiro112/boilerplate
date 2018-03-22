'use strict';

require('app-module-path/register');

const request = require('supertest');
const should = require('chai').should();
const server = require('../../server');
const api = request(server.app);

after('close server', function () {
    server.handler.close();
});

describe('Auth', () => {
    it('should be successful', done => {
        api.post('/auth')
            .send({
                username: 'test',
                password: 'secret'
            })
            .expect(200)
            .end(err => {
                should.not.exist(err);
                
                done();
            });
    });

    it('should be invalid username', done => {
        api.post('/auth')
            .send({
                username: 'wswswsws',
                password: 'secret'
            })
            .expect(401)
            .end((err, res) => {
                should.not.exist(err);
                res.body.code.should.equal('LOG_FAIL');

                done();
            });
    });

    it('should be incorrect password', done => {
        api.post('/auth')
            .send({
                username: 'test',
                password: 'wswswsws'
            })
            .expect(401)
            .end((err, res) => {
                should.not.exist(err);
                res.body.code.should.equal('LOG_FAIL');

                done();
            });
    });
});