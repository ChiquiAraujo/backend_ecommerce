const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app');

describe('Sesiones', () => {
  it('POST /api/sessions - debe iniciar sesión para un usuario', (done) => {
    request(app)
      .post('/api/sessions')
      .send({ username: 'usuario', password: 'contraseña' })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('token');
        done(err);
      });
  });

  it('DELETE /api/sessions - debe cerrar la sesión del usuario', (done) => {
    request(app)
      .delete('/api/sessions')
      .set('Authorization', `Bearer token_de_usuario`)
      .expect(200, done);
  });

});

module.exports = {
  sessionsTests: describe
};
