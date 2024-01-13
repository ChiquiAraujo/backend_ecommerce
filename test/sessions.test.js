const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app');

describe('Sesiones', () => {
  it('POST /api/sessions - debe iniciar sesión para un usuario', (done) => {
    request(app)
      .post('/api/sessions')
      .send({ email: 'ck2inf@gmail.com', password: process.env.EMAIL_PASS })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        done(err);
      });
  });

  it('DELETE /api/sessions - debe cerrar la sesión del usuario', (done) => {
    const userToken = process.env.TOKEN_USER;
    
    request(app)
      .delete('/api/sessions')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Sesión cerrada con éxito');
        done(err);
      });
  });
});