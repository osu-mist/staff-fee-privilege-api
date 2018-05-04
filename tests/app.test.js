const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const { app } = require('../app');

chai.use(chaiHttp);
const { expect } = chai;
const { authentication } = config;

// Genric HTTP test cases
const httpAssertion = (res, status, contentType) => {
  expect(res).to.have.status(status);
  expect(res).to.have.header('content-type', contentType);
};

describe('HTTP integration tests', () => {
  it('should return 200 (OK)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .auth(authentication.username, authentication.password)
      .query({ term: '201801' })
      .end((err, res) => {
        httpAssertion(res, 200, 'application/json; charset=utf-8');
        done();
      });
  });

  it('should return 400 (Bad Request)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .auth(authentication.username, authentication.password)
      .end((err, res) => {
        httpAssertion(res, 400, 'application/json; charset=utf-8');
        done();
      });
  });

  it('should return 401 (Unauthorized)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege')
      .end((err, res) => {
        httpAssertion(res, 401, 'application/json; charset=utf-8');
        done();
      });
  });

  it('should return 404 (Not Found)', (done) => {
    chai.request(app)
      .get('/staff-fee-privilege/123456789')
      .auth(authentication.username, authentication.password)
      .end((err, res) => {
        httpAssertion(res, 404, 'application/json; charset=utf-8');
        done();
      });
  });
});
