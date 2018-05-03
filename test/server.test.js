const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

const { app } = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;
const authentication = config.authentication;

// Genric HTTP test cases
const httpAssertion = (res, err, status, contentType) => {
  expect(err).to.be.null;
  expect(res).to.have.status(status);
  expect(res).to.have.header('content-type', contentType);
};

describe('GET /staff-fee-privilege', () => {
  it('should return 200 (OK)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .auth(authentication.username, authentication.password)
      .query({ 'term': '201801' })
      .end((err, res) => {
        httpAssertion(res, err, 200, 'application/json; charset=utf-8');
        done();
      });
  });

  it('should return 400 (Bad Request)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .auth(authentication.username, authentication.password)
      .end((err, res) => {
        httpAssertion(res, err, 400, 'application/json; charset=utf-8');
        done();
      });
  });

  it('should return 401 (Unauthorized)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .end((err, res) => {
        httpAssertion(res, err, 401, 'application/json; charset=utf-8');
        done();
      });
  });
});

describe('GET /staff-fee-privilege/:id', () => {
  it('should return 200 (OK)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege/930686277')
      .auth(authentication.username, authentication.password)
      .end((err, res) => {
        httpAssertion(res, err, 200, 'application/json; charset=utf-8');
        done();
      });
  });
  it('should return 401 (Unauthorized)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege/:id')
      .end((err, res) => {
        httpAssertion(res, err, 401, 'application/json; charset=utf-8');
        done();
      });
  });
  it('should return 404 (Not Found)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege/123456789')
      .auth(authentication.username, authentication.password)
      .end((err, res) => {
        httpAssertion(res, err, 404, 'application/json; charset=utf-8');
        done();
      });
  });
});
