import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/auth';

describe('Authentication endpoints', () => {
  /* eslint-disable no-unused-expressions */
  describe('Sign up', () => {
    const defaultUser = {
      firstname: 'Lorem',
      lastname: 'Ipsum',
      email: 'lorem@gmail.com',
      phone: '08087765646',
      password: 'password',
      address: '123 Gate av, New York, USA',
    };
    it('It should ensure that first name is not empty', (done) => {
      const newUser = { ...defaultUser, firstname: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('First name is required');
          done();
        });
    });
    it('It should ensure that last name is not empty', (done) => {
      const newUser = { ...defaultUser, lastname: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Last name is required');
          done();
        });
    });
    it('It should ensure that email is not empty', (done) => {
      const newUser = { ...defaultUser, email: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Email is required');
          done();
        });
    });
    it('It should ensure that email is a valid one', (done) => {
      const newUser = { ...defaultUser, email: 'loremIpsum.com' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Invalid email');
          done();
        });
    });
    it('It should ensure that phone number is not empty', (done) => {
      const newUser = { ...defaultUser, phone: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The phone number is required');
          done();
        });
    });
    it('It should ensure that phone number is not less than 11 characters', (done) => {
      const newUser = { ...defaultUser, phone: '0908775675' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Enter a valid phone number');
          done();
        });
    });
    it('It should ensure that password is not empty', (done) => {
      const newUser = { ...defaultUser, password: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Password is required');
          done();
        });
    });
    it('It should ensure that password is not not less than 6 characters', (done) => {
      const newUser = { ...defaultUser, password: '12345' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Password cannot be less then 6 characters');
          done();
        });
    });
    it('It should ensure that address is not empty', (done) => {
      const newUser = { ...defaultUser, address: '' };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Address is required');
          done();
        });
    });
    it('It should return a user exist error', (done) => {
      const email = 'admin@gmail.com';
      const newUser = { ...defaultUser, email };
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.error).to.eql(`User with email ${email} already exists`);
          done();
        });
    });
    it('It should successfully signup user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(defaultUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          done();
        });
    });
  });

  describe('Login', () => {
    const defaultUser = {
      email: 'admin@gmail.com',
      password: 'password',
    };
    it('It should ensure that email is not empty', (done) => {
      const newUser = { ...defaultUser, email: '' };
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Email is required');
          done();
        });
    });
    it('It should ensure that password is not empty', (done) => {
      const newUser = { ...defaultUser, password: '' };
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Password is required');
          done();
        });
    });
    it('It should return invalid email and password', (done) => {
      const newUser = { ...defaultUser, email: 'fakeuser@gmail.com' };
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql(true);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Invalid email or password');
          done();
        });
    });
    it('It should successfully login user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(defaultUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(1);
          expect(res.body.message).to.eql('Login successful');
          done();
        });
    });
  });
});
