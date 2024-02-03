const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app');

describe('Payment Intent', () => {
  it('POST /api/payments/intent - debe crear un Payment Intent', (done) => {
    request(app)
      .post('/api/payments/intent')
      .send({ amount: 1000, currency: 'usd' })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('client_secret');
        done(err);
      });
  });
});
