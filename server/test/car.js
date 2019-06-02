import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/car';

describe('Car endpoints', () => {
  /* eslint-disable no-unused-expressions */
  let userToken;
  const invalidToken = 'Bearer xxxxxxxxxxxxxxx123456';
  before('Login to get access token', () => {
    const defaultUser = {
      email: 'user@gmail.com',
      password: 'password',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultUser)
      .end((err, res) => {
        const token = res.body.data[0].token;
        userToken = `Bearer ${token}`;
      });
  });
  describe('Create car ad', () => {
    const defaultCar = {
      state: 'Used',
      price: '120000.00',
      manufacturer: 'Benz',
      model: 'AMG',
      bodyType: 'car',
    };
    it('It should ensure that token is provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql('You must log in to continue');
          done();
        });
    });
    it('It should ensure that the provided token is valid', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set('authorization', invalidToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql('Invalid token, kindly log in to continue');
          done();
        });
    });
    it('It should ensure that car state is not empty', (done) => {
      const newCar = { ...defaultCar, state: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car state is required');
          done();
        });
    });
    it('It should ensure that car price is not empty', (done) => {
      const newCar = { ...defaultCar, price: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car price is required');
          done();
        });
    });
    it('It should ensure that car manufacturer is not empty', (done) => {
      const newCar = { ...defaultCar, manufacturer: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car manufacturer is required');
          done();
        });
    });
    it('It should ensure that car model is not empty', (done) => {
      const newCar = { ...defaultCar, model: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car model is required');
          done();
        });
    });
    it('It should ensure that body type is not empty', (done) => {
      const newCar = { ...defaultCar, bodyType: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car body type is required');
          done();
        });
    });
    it('It should successfully create a car ad', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set('authorization', userToken)
        .end((err, res) => {
            console.log(res.body)
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          done();
        });
    });
  });
  describe('Update car ad status', () => {
    let carId;
    const invalidCarId = 'fiutj4ut';
    let wrongCarOwnerToken;
    const newStatus = { status: 'sold' };
    const invalidStatus = { status: 'Lorem' };
    before('Create a car ad to be updated', () => {
      const defaultCar = {
        state: 'New',
        price: '120000.00',
        manufacturer: 'Toyota',
        model: 'Corolla 2012',
        bodyType: 'car',
      };
      const user = {
        firstname: 'Foo',
        lastname: 'Bar',
        email: 'foo@bar.com',
        password: 'sha1$fc8dc1d2$1$036ea46b75d0017897c09a4022c90787e5287778',
        phone: '08098876756',
        address: 'Ajao Estate',
      };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set('authorization', userToken)
        .end((err, res) => {
          carId = res.body.data[0].id;
        });
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          wrongCarOwnerToken = `Bearer ${res.body.data[0].token}`;
        });
    });

    it('It should return car ad does not exist', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${invalidCarId}/status`)
        .send(newStatus)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Car Ad with id: ${invalidCarId} does not exist`);
          done();
        });
    });

    it('It should return permision denied', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send(newStatus)
        .set('authorization', wrongCarOwnerToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql('Permission denied, you can only update Ads posted by you');
          done();
        });
    });


    it('It should ensure that status is provided', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send({ status: '' })
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car status is required');
          done();
        });
    });

    it('It should return invalid status error', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send(invalidStatus)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car status can only be sold or available');
          done();
        });
    });

    it('It should successfully update car ad status', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send(newStatus)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          done();
        });
    });
  });
});
