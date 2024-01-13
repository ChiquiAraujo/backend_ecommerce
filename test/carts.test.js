const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Carritos', () => {
 describe('GET /api/carts', () => {
   it('debe retornar los carritos', (done) => {
     chai.request(app)
       .get('/api/carts')
       .end((err, res) => {
         expect(res).to.have.status(200);
         expect(res.body).to.be.an('array');
         done(err);
       });
   });
 });
});

module.exports = app;