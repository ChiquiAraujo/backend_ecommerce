const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app');

describe('Productos', () => {
  it('GET /api/products - debe retornar todos los productos', (done) => {
    request(app)
      .get('/api/products')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done(err);
      });
  });
});
module.exports = app;
