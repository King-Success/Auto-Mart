import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/flag';

describe('Flag endpoints', function () {
  this.timeout(0);
  let userToken;
  before('signin to get access token', async () => {
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
  describe('Flag a car Ad', () => {
    const defaultOrder = {
      car_id: 1,
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
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
