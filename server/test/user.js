import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/user';

describe('User endpoints', function () {
  this.timeout(0);
  let userToken;
  before('Login to get access token', async () => {
    const defaultUser = {
      email: 'elon.user@gmail.com',
      password: 'secret',
    };
    const userRes = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(defaultUser);
    const token = userRes.body.data.token;
    userToken = `Bearer ${token}`;
  });
  describe('Get a single user', () => {
    it('It should return a single user instance', (done) => {
      chai.request(app)
        .get(`${baseUrl}/1`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          done();
        });
    });
    it('It should return a user not found error', (done) => {
      chai.request(app)
        .get(`${baseUrl}/5000`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.have.eq('user not found');
          done();
        });
    });
  });
});
