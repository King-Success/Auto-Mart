import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/car';

describe('Car endpoints', function () {
  this.timeout(0)
  let userToken;
  let adminToken;
  const invalidToken = 'Bearer xxxxxxxxxxxxxxx123456';
  before('Login to get access token', async () => {
    const defaultUser = {
      email: 'elon.user@gmail.com',
      password: 'secret'
    };
    const admin = {
      email: 'kingsley.admin@gmail.com',
      password: 'secret'
    }
    const userRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultUser);
    const token1 = userRes.body.data[0].token;
    userToken = `Bearer ${token1}`;
    const adminRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(admin);
    const token2 = adminRes.body.data[0].token;
    adminToken = `Bearer ${token2}`;
  });
  describe('Create car ad', () => {
    const defaultCar = {
      state: 'Used',
      price: '120000.00',
      manufacturer: 'Benz',
      model: 'AMG',
      bodyType: 'car',
      mainImageUrl: 'mainImageUrl.com'
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
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car state is required');
          expect(res.body.errors[1]).to.eql('Car state can only contain alphabets');
          expect(res.body.errors[2]).to.eql('Car state must be either New or Used, notice the uppercase');
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
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car price is required');
          expect(res.body.errors[1]).to.eql('Car price must be a valid number in two decimal place, e.g 123000.00');
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
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car body type is required');
          done();
        });
    });
    it('It should ensure that main image url is not empty', (done) => {
      const newCar = { ...defaultCar, mainImageUrl: '' };
      chai.request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car main image url is required');
          done();
        });
    });
    it('It should successfully create a car ad', (done) => {
      chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
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

  describe('Get all cars Ads', () => {
    it('It should ensure that the provided token has an admin access', (done) => {
      chai.request(app)
        .get(`${baseUrl}`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.eql('Only an Admin can perform this task');
          done()
        })
    })
    it('It should return all car Ads sold or not', (done) => {
      chai.request(app)
        .get(`${baseUrl}`)
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
  })
  describe('Update car ad status', () => {
    let carId;
    const invalidCarId = '1000';
    let wrongCarOwnerToken;
    const newStatus = { status: 'Sold' };
    const invalidStatus = { status: 'Lorem' };
    before('Create a car ad to be updated', async () => {
      const defaultCar = {
        state: 'New',
        price: '120000.00',
        manufacturer: 'Toyota',
        model: 'Corolla 2012',
        bodyType: 'car',
        mainImageUrl: 'mainImageUrl.com'
      };
      const user = {
        firstname: 'Foo',
        lastname: 'Bar',
        email: 'foo@bar.com',
        password: 'sha1$fc8dc1d2$1$036ea46b75d0017897c09a4022c90787e5287778',
        phone: '08098876756',
        address: 'Ajao Estate',
      };
      const car = await chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set('authorization', userToken);
      carId = car.body.data[0].id;

      const wrongUser = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
      wrongCarOwnerToken = `Bearer ${wrongUser.body.data[0].token}`;

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
          expect(res.body.errors[1]).to.eql('Car status can only be Sold or Available, notice the uppercase');
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
          expect(res.body.errors[0]).to.eql('Car status can only be Sold or Available, notice the uppercase');
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

  describe('Update car ad price', () => {
    let carId;
    let wrongCarOwnerToken
    const newPrice = { price: '1200000.00' };
    const invalidPrice = { price: '120000' };
    before('Create a car ad to be updated', async () => {
      const defaultCar = {
        state: 'New',
        price: '120000.00',
        manufacturer: 'Toyota',
        model: 'Corolla 2012',
        bodyType: 'car',
        mainImageUrl: 'mainImageUrl.com'
      };
      const user = {
        firstname: 'Foo',
        lastname: 'Bar',
        email: 'foos@bar.com',
        password: 'sha1$fc8dc1d2$1$036ea46b75d0017897c09a4022c90787e5287778',
        phone: '08098855756',
        address: 'Ajao Estate',
      };
      const car = await chai.request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set('authorization', userToken);
      carId = car.body.data[0].id;

      const wrongUser = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);
      wrongCarOwnerToken = `Bearer ${wrongUser.body.data[0].token}`;

    });

    it('It should ensure that price is provided', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/price`)
        .send({ price: '' })
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car price is required');
          expect(res.body.errors[1]).to.eql('Car price must be a valid number in two decimal place, e.g 123000.00');
          done();
        });
    });

    it('It should return invalid price error', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/price`)
        .send(invalidPrice)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Car price must be a valid number in two decimal place, e.g 123000.00');
          done();
        });
    });

    it('It should successfully update car ad price', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/${carId}/price`)
        .send(newPrice)
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
  describe('Filter cars by status', () => {
    it('It should ensure that the right status is provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByStatus?status=available`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.be.eql('status must either be Sold or Availble, notice the uppercase');
          done()
        })
    })
    it('It should return all car Ads filtered by status', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByStatus?status=Available`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
  })
  describe('Filter cars by state', () => {
    it('It should ensure that the right state is provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByState?status=Available&state=new`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.be.eql('state must either be Used or New, notice the uppercase');
          done()
        })
    })
    it('It should return all car Ads filtered by state', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByState?status=Available&state=New`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
  })
  describe('Filter cars by manufacturer', () => {
    it('It should return all car Ads filtered by manufacturer', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByManufacturer?status=Available&manufacturer=Tesla`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
    it('It should return no car exist with the provided manufacturer', (done) => {
      chai.request(app)
      .get(`${baseUrl}/getByManufacturer?status=Available&manufacturer=FakeTesla`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.eql('No car exist with manufacturer: FakeTesla, manufacturer is case sensitive')
          done()
        })
    })
  })
  describe('Filter cars by price', () => {
    it('It should ensure that minPrice is provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByPrice?status=Available&maxPrice=12000000`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.be.eql('There must also be a minPrice');
          done()
        })
    })
    it('It should ensure that maxPrice is provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/getByPrice?status=Available&minPrice=12000000`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.be.eql('There must also be a maxPrice');
          done()
        })
    })
    it('It should return all car Ads filtered by price', (done) => {
      chai.request(app)
      .get(`${baseUrl}/getByPrice?status=Available&minPrice=400000.00&maxPrice=20000000.00`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
    it('It should return no car exist with the provided price range', (done) => {
      chai.request(app)
      .get(`${baseUrl}/getByPrice?status=Available&minPrice=990000000.00&maxPrice=99900000000.00`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.eql('No car exist with price between 990000000.00 and 99900000000.00')
          done()
        })
    })
  })

  describe('Filter cars by body type', () => {
    it('It should return all car Ads filtered by bodyType', (done) => {
      chai.request(app)
      .get(`${baseUrl}/getByBodyType?status=Available&bodyType=car`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
    it('It should return no car exist with the provided bodyType', (done) => {
      chai.request(app)
      .get(`${baseUrl}/getByBodyType?status=Available&bodyType=FakeType`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.eql('No car exist with body type: FakeType, body type is case sensitive')
          done()
        })
    })
  })
  describe('Get a specific car by id', () => {
    const carId = 1
    const invalidCarId = 686
    it('It should return a specific car with the provided id', (done) => {
      chai.request(app)
      .get(`${baseUrl}/${carId}`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })
    it('It should return no car exist with the provided id', (done) => {
      chai.request(app)
      .get(`${baseUrl}/${invalidCarId}`)
      .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.eql(`Car with id: ${invalidCarId} does not exist`)
          done()
        })
    })
  })
  describe('Admin delete a specific car by id', () => {
    const carId = 2
    const invalidCarId = 686
    it('It should delete the car with the provided id', (done) => {
      chai.request(app)
      .delete(`${baseUrl}/${carId}`)
      .set('authorization', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body).to.have.property('message')
          expect(res.body.data).to.be.an('array')
          expect(res.body.message).to.eq('Car Ad deleted successfully')
          done()
        })
    })
    it('It should return no car exist with the provided id', (done) => {
      chai.request(app)
      .delete(`${baseUrl}/${invalidCarId}`)
      .set('authorization', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.eql(`Car with id: ${invalidCarId} not found`)
          done()
        })
    })
  })
});
