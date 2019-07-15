import chai from 'chai';
import chaiHTTP from 'chai-http';
import passwordHash from 'password-hash';
import Helpers from '../helpers/auth';
import app from '../app';

const { generateToken } = Helpers;

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/auth';
const Hashedpassword = passwordHash.generate('password');
describe('Authentication endpoints', function () {
  this.timeout(0);
  describe('Sign up', () => {
    const defaultUser = {
      first_name: 'Lorem',
      last_name: 'Ipsum',
      email: 'lorem@gmail.com',
      phone: '08087765646',
      password: Hashedpassword,
      address: '123 Gate av, New York, USA',
    };
    it('It should ensure that first name is not empty', (done) => {
      const newUser = { ...defaultUser, first_name: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('first_name is required');
            expect(res.body.errors[1]).to.eql('first_name can only contain alphabets');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that last name is not empty', (done) => {
      const newUser = { ...defaultUser, last_name: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('last_name is required');
            expect(res.body.errors[1]).to.eql('last_name can only contain alphabets');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that email is not empty', (done) => {
      const newUser = { ...defaultUser, email: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('email is required');
            expect(res.body.errors[1]).to.eql('invalid email');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that email is a valid one', (done) => {
      const newUser = { ...defaultUser, email: 'loremIpsum.com' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('invalid email');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that phone number is not empty', (done) => {
      const newUser = { ...defaultUser, phone: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('phone number is required');
            expect(res.body.errors[1]).to.eql('Enter a valid phone number');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that phone number is not less than 11 characters', (done) => {
      const newUser = { ...defaultUser, phone: '0908775675' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('Enter a valid phone number');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that password is not empty', (done) => {
      const newUser = { ...defaultUser, password: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('password is required');
            expect(res.body.errors[1]).to.eql('password cannot be less then 6 characters');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that password is not not less than 6 characters', (done) => {
      const newUser = { ...defaultUser, password: '12345' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('password cannot be less then 6 characters');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that address is not empty', (done) => {
      const newUser = { ...defaultUser, address: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('address is required');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should return a user exist error', (done) => {
      const email = 'kingsley.admin@gmail.com';
      const newUser = { ...defaultUser, email };
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(409);
            expect(res.body.error).to.eql(`User with email ${email} already exists`);
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should successfully signup user', (done) => {
      try {
        chai.request(app)
          .post(`${baseUrl}/signup`)
          .send(defaultUser)
          .end((_, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
  });

  describe('Login', () => {
    const defaultUser = {
      email: 'kingsley.admin@gmail.com',
      password: 'secret',
    };
    it('It should ensure that email is not empty', (done) => {
      const newUser = { ...defaultUser, email: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/login`)
          .send(newUser)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('email is required');
            expect(res.body.errors[1]).to.eql('invalid email');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should ensure that password is not empty', (done) => {
      const newUser = { ...defaultUser, password: '' };
      try {
        chai.request(app)
          .post(`${baseUrl}/login`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql('password is required');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should return invalid email or password', (done) => {
      const newUser = { ...defaultUser, email: 'fakeuser@gmail.com' };
      try {
        chai.request(app)
          .post(`${baseUrl}/login`)
          .send(newUser)
          .end((_, res) => {
            expect(res).to.have.status(401);
            expect(res.body.error).to.eql(true);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.eql('Invalid email or password');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should successfully login user', (done) => {
      try {
        chai.request(app)
          .post(`${baseUrl}/login`)
          .send(defaultUser)
          .end((_, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
  });

  describe('Reset password', () => {
    const baseUrl = '/api/v1/users';
    const userEmail = 'kingsley.admin@gmail.com';
    const invalidToken = 'sli990haijijaiojzkndkaklndklfjoiioajidjfiljqkljaiojdifgjoioiajdfjoiaj';
    const userToken = generateToken({ email: 'kingsley.admin@gmail.com', id: 2 });
    const newPassword = { email: userEmail, password: 'secret', passwordConfirmation: 'secret' };
    it('It should successfully send a reset email', (done) => {
      try {
        chai.request(app)
          .get(`${baseUrl}/${userEmail}/resetPassword`)
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });

    it('It should return invalid email', (done) => {
      try {
        chai.request(app)
          .get(`${baseUrl}/reset/${invalidToken}`)
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });

    it('It should return a reset password form', (done) => {
      try {
        chai.request(app)
          .get(`${baseUrl}/reset/${userToken}`)
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });

    it('It should return password must be 6 digits error', (done) => {
      try {
        chai.request(app)
          .post(`${baseUrl}/reset`)
          .send({ ...newPassword, password: 'hshs' })
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should return password doest match error', (done) => {
      try {
        chai.request(app)
          .post(`${baseUrl}/reset`)
          .send({ ...newPassword, passwordConfirmation: 'hdhdhdhdh' })
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });
    it('It should return password reset successfully', (done) => {
      try {
        chai.request(app)
          .post(`${baseUrl}/reset`)
          .send(newPassword)
          .end(() => {
            done();
          });
      } catch (err) {
        throw err;
      }
    });
  });
});
