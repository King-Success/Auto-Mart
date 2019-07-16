import chai from "chai";
import chaiHTTP from "chai-http";
import app from "../app";

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = "/api/v1/car";

describe("Car endpoints", function() {
  this.timeout(0);
  let userToken;
  let adminToken;
  const invalidToken = "Bearer xxxxxxxxxxxxxxx123456";
  before("signin to get access token", async () => {
    const defaultUser = {
      email: "elon.user@gmail.com",
      password: "secret"
    };
    const admin = {
      email: "kingsley.admin@gmail.com",
      password: "secret"
    };
    const userRes = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(defaultUser);
    const token1 = userRes.body.data.token;
    userToken = `Bearer ${token1}`;
    const adminRes = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(admin);
    const token2 = adminRes.body.data.token;
    adminToken = `Bearer ${token2}`;
  });
  describe("Create car ad", () => {
    const defaultCar = {
      state: "used",
      price: "1500000",
      manufacturer: "Benz",
      model: "AMG",
      body_type: "car",
      main_image_url: "main_image_url.com"
    };
    it("It should ensure that token is provided", done => {
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql("You must log in to continue");
          done();
        });
    });
    it("It should ensure that the provided token is valid", done => {
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set("authorization", invalidToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql(
            "Invalid token, kindly log in to continue"
          );
          done();
        });
    });
    it("It should ensure that car state is not empty", done => {
      const newCar = { ...defaultCar, state: "" };
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("state is required");
          expect(res.body.error[1]).to.eql("state can only contain alphabets");
          done();
        });
    });
    it("It should ensure that car price is not empty", done => {
      const newCar = { ...defaultCar, price: "" };
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("price is required");
          expect(res.body.error[1]).to.eql("price must be a valid number");
          done();
        });
    });
    it("It should ensure that car manufacturer is not empty", done => {
      const newCar = { ...defaultCar, manufacturer: "" };
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("manufacturer is required");
          done();
        });
    });
    it("It should ensure that car model is not empty", done => {
      const newCar = { ...defaultCar, model: "" };
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("model is required");
          done();
        });
    });
    it("It should ensure that body type is not empty", done => {
      const newCar = { ...defaultCar, body_type: "" };
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("body_type is required");
          done();
        });
    });
    it("It should successfully create a car ad", done => {
      chai
        .request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          done();
        });
    });
  });

  describe("Get all cars Ads", () => {
    it("It should return all car Ads sold or not", done => {
      chai
        .request(app)
        .get(`${baseUrl}`)
        .set("authorization", adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });
  describe("Update car ad status", () => {
    let carId;
    const invalidCarId = "1000";
    const newStatus = { status: "sold" };
    const invalidStatus = { status: "lorem" };
    let wrongCarOwnerToken;
    before("Create a car ad to be updated", async () => {
      const defaultCar = {
        state: "new",
        price: "120000",
        manufacturer: "Toyota",
        model: "Corolla 2012",
        body_type: "car",
        main_image_url: "main_image_url.com"
      };
      const user = {
        first_name: "Foo",
        last_name: "Bar",
        email: "foo@bar.com",
        password: "sha1$fc8dc1d2$1$036ea46b75d0017897c09a4022c90787e5287778",
        phone: "08098876756",
        address: "Ajao Estate"
      };
      const car = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set("authorization", userToken);
      carId = car.body.data.id;
      const wrongUser = await chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send(user);
      wrongCarOwnerToken = `Bearer ${wrongUser.body.data.token}`;
    });

    it("It should return car ad does not exist", done => {
      chai
        .request(app)
        .patch(`${baseUrl}/${invalidCarId}/status`)
        .send(newStatus)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(
            `Car Ad with id: ${invalidCarId} does not exist`
          );
          done();
        });
    });

    it("It should return permision denied", done => {
      chai
        .request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send(newStatus)
        .set("authorization", wrongCarOwnerToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql(
            "Permission denied, you can only update Ads posted by you"
          );
          done();
        });
    });

    it("It should ensure that status is provided", done => {
      chai
        .request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send({ status: "" })
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error[0]).to.eql("status is required");
          done();
        });
    });
    it("It should successfully update car ad status", done => {
      chai
        .request(app)
        .patch(`${baseUrl}/${carId}/status`)
        .send(newStatus)
        .set("authorization", userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          done();
        });
    });
  });

  describe("Update car ad price", () => {
    let carId;
    const newPrice = { price: "1200000" };
    const invalidPrice = { price: "12000r0" };
    before("Create a car ad to be updated", async () => {
      const defaultCar = {
        state: "new",
        price: "120000",
        manufacturer: "Toyota",
        model: "Corolla 2012",
        body_type: "car",
        main_image_url: "main_image_url.com"
      };
      const car = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(defaultCar)
        .set("authorization", userToken);
      carId = car.body.data.id;
      it("It should ensure that price is provided", done => {
        chai
          .request(app)
          .patch(`${baseUrl}/${carId}/price`)
          .send({ price: "" })
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql("price is required");
            expect(res.body.errors[1]).to.eql("price must be a valid number");
            done();
          });
      });

      it("It should return invalid price error", done => {
        chai
          .request(app)
          .patch(`${baseUrl}/${carId}/price`)
          .send(invalidPrice)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.errors[0]).to.eql("price must be a valid number");
            done();
          });
      });

      it("It should successfully update car ad price", done => {
        chai
          .request(app)
          .patch(`${baseUrl}/${carId}/price`)
          .send(newPrice)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("object");
            done();
          });
      });
    });
    describe("Filter cars by status", () => {
      it("It should return all car Ads filtered by status", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByStatus?status=available`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("array");
            done();
          });
      });
    });
    describe("Filter cars by state", () => {
      it("It should return all car Ads filtered by state", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByState?status=available&state=new`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("array");
            done();
          });
      });
    });
    describe("Filter cars by manufacturer", () => {
      it("It should return all car Ads filtered by manufacturer", done => {
        chai
          .request(app)
          .get(
            `${baseUrl}/getByManufacturer?status=available&manufacturer=Toyota`
          )
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("array");
            done();
          });
      });
      it("It should return no car exist with the provided manufacturer", done => {
        chai
          .request(app)
          .get(
            `${baseUrl}/getByManufacturer?status=available&manufacturer=FakeTesla`
          )
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              "No car exist with manufacturer: FakeTesla, manufacturer is case sensitive"
            );
            done();
          });
      });
    });
    describe("Get user cars", () => {
      it("It should return all users cars", done => {
        chai
          .request(app)
          .get(`${baseUrl}/history`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("array");
            done();
          });
      });
      it("It should return no cars found error", done => {
        chai
          .request(app)
          .get(`${baseUrl}/history`)
          .set("authorization", adminToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.be.eql("No cars found");
            done();
          });
      });
    });
    describe("Filter cars by price", () => {
      it("It should ensure that minPrice is provided", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByPrice?status=available&max_price=12000000`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.be.eql("There must also be a min_price");
            done();
          });
      });
      it("It should ensure that maxPrice is provided", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByPrice?status=available&min_price=12000000`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.be.eql("There must also be a max_price");
            done();
          });
      });
      it("It should return all car Ads filtered by price", done => {
        chai
          .request(app)
          .get(
            `${baseUrl}/getByPrice?status=available&min_price=4000000&max_price=200000000`
          )
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              "No car exist with price between 4000000 and 200000000"
            );
            done();
          });
      });
      it("It should return no car exist with the provided price range", done => {
        chai
          .request(app)
          .get(
            `${baseUrl}/getByPrice?status=available&min_price=990000000&max_price=99900000000`
          )
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              "No car exist with price between 990000000 and 99900000000"
            );
            done();
          });
      });
    });

    describe("Filter cars by body type", () => {
      it("It should return all car Ads filtered by body_type", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByBodyType?status=available&body_type=car`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("array");
            done();
          });
      });
      it("It should return no car exist with the provided bodyType", done => {
        chai
          .request(app)
          .get(`${baseUrl}/getByBodyType?status=available&body_type=FakeType`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              "No car exist with body type: FakeType, body_type is case sensitive"
            );
            done();
          });
      });
    });
    describe("Get a specific car by id", () => {
      const carId = 1;
      const invalidCarId = 686;
      it("It should return a specific car with the provided id", done => {
        chai
          .request(app)
          .get(`${baseUrl}/${carId}`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            done();
          });
      });
      it("It should return no car exist with the provided id", done => {
        chai
          .request(app)
          .get(`${baseUrl}/${invalidCarId}`)
          .set("authorization", userToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              `Car with id: ${invalidCarId} does not exist`
            );
            done();
          });
      });
    });
    describe("Admin delete a specific car by id", () => {
      const carId = 2;
      const invalidCarId = 686;
      it("It should delete the car with the provided id", done => {
        chai
          .request(app)
          .delete(`${baseUrl}/${carId}`)
          .set("authorization", adminToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.eq("Car Ad successfully deleted");
            done();
          });
      });
      it("It should return no car exist with the provided id", done => {
        chai
          .request(app)
          .delete(`${baseUrl}/${invalidCarId}`)
          .set("authorization", adminToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.eql(
              `Car with id: ${invalidCarId} not found`
            );
            done();
          });
      });
    });
  });
});
