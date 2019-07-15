import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/order';

describe('Order endpoints', function () {
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
    const token = userRes.body.data.token;
    userToken = `Bearer ${token}`;
  });
  describe('Create new order', () => {
    const defaultOrder = {
      car_id: 1,
      amount: '45000000',
    };
    const invalidCarId = 6859;
    it('It should ensure that car id is not empty', (done) => {
      const newOrder = { ...defaultOrder, car_id: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newOrder)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('car_id is required');
          done();
        });
    });
    it('It should ensure that order amount is not empty', (done) => {
      const newOrder = { ...defaultOrder, amount: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newOrder)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('amount is required');
          expect(res.body.errors[1]).to.eql('amount must be a valid number');
          done();
        });
    });
    it('It should ensure that car exist', (done) => {
      const newOrder = { ...defaultOrder, car_id: invalidCarId };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newOrder)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Car Ad with id: ${invalidCarId} does not exist`);
          done();
        });
    });
    it('It should successfully create an order', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultOrder)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });
  });

  describe('Update order amount', () => {
    const newAmount = { amount: '1200000' };
    const invalidAmount = { amount: '120y000' };
    const orderId = 1;
    it('It should ensure that amount is provided', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${orderId}/price`)
        .send({ amount: '' })
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('amount is required');
          expect(res.body.errors[1]).to.eql('amount must be a valid number');
          done();
        });
    });

    it('It should return invalid amount error', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${orderId}/price`)
        .send(invalidAmount)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('amount must be a valid number');
          done();
        });
    });

    it('It should successfully update order amount', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${orderId}/price`)
        .send(newAmount)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });
  });
});
