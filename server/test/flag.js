import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/flag';

describe('Flag endpoints', function () {
  this.timeout(0);
  let userToken;
  before('Login to get access token', async () => {
    const defaultUser = {
      email: 'elon.user@gmail.com',
      password: 'secret',
    };
    const userRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultUser);
    const token = userRes.body.data[0].token;
    userToken = `Bearer ${token}`;
  });
  describe('Flag a car Ad', () => {
    const defaultOrder = {
      carId: 1,
      reason: 'Wrong pictures',
      description: 'All the images provided are not original'
    };
    it('It should successfully flag a car ad', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultOrder)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          done();
        });
    });
  });
});
