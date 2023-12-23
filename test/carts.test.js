const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app');

describe('Carritos', () => {
  it('GET /api/carts - debe retornar todos los carritos', (done) => {
    request(app)
      .get('/api/carts')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done(err);
      });
  });
});
module.exports = app;
