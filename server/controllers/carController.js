import carModel from "../models/cars";

class CarController {
  static async createCarAd(req, res) {
    try {
      const { id: owner } = req.body.tokenPayload;
      const {
        state,
        price,
        manufacturer,
        model,
        body_type,
        main_image_url
      } = req.body;
      const values = [
        owner,
        state,
        price,
        manufacturer,
        model,
        body_type,
        main_image_url
      ];
      const car = await carModel.create(values);
      if (car) {
        return res.status(201).json({
          status: 201,
          data: car
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }

  static async updateCarAdStatus(req, res) {
    const { carId } = req.params;
    let { status } = req.body;
    if (!status) status = "sold";
    const data = { name: "status", value: status };
    try {
      const car = await carModel.update(carId, data);
      if (car) {
        return res.status(200).json({
          status: 200,
          data: car
        });
      }
    } catch (err) {
      console.log("update car status server err", err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server error" });
    }
  }

  static async updateCarAdPrice(req, res) {
    const { carId } = req.params;
    const { price } = req.body;
    const data = { name: "price", value: price };
    try {
      const car = await carModel.update(carId, data);
      if (car) {
        return res.status(200).json({
          status: 200,
          data: car
        });
      }
      console.log("update car status not found err", car);
      return res
        .status(500)
        .json({ status: 404, error: `Car with id: ${carId} does not exist` });
    } catch (err) {
      console.log("update car price server err", err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server error" });
    }
  }

  static async getACar(req, res) {
    try {
      const { carId } = req.params;
      const car = await carModel.getById(carId);
      if (car) {
        return res.status(200).json(car);
      }
      console.log("get car status not found", car);
      return res.status(404).json({
        status: 404,
        error: `Car with id: ${carId} does not exist`
      });
    } catch (err) {
      console.log("get car server err", err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getAllCars(req, res) {
    try {
      const cars = await carModel.getAll();
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      console.log("get all car not found err", cars);
      return res.status(404).json({
        status: 404,
        error: "No car exist"
      });
    } catch (err) {
      console.log("get all car server err", err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async deleteCarAd(req, res) {
    const { carId } = req.params;
    try {
      const car = await carModel.delete(carId);
      if (car) {
        return res.status(200).json({
          status: 204,
          message: "Car Ad successfully deleted"
        });
      }
      console.log("delete car not found err", car);
      return res
        .status(404)
        .json({ status: 404, message: `Car with id: ${carId} not found` });
    } catch (err) {
      console.log("delete car server err", err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server error" });
    }
  }

  static async getCarsByStatus(req, res) {
    const { status } = req.query;
    try {
      const cars = await carModel.getByStatus(status);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: `No car exist with status: ${status}, status is case sensitive`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getCarsByState(req, res) {
    const { status, state } = req.query;
    const filter = { name: "state", value: state };
    try {
      const cars = await carModel.getByFilter(status, filter);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: `No car exist with state: ${state}, state is case sensitive`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getCarsByManufacturer(req, res) {
    const { status, manufacturer } = req.query;
    const filter = { name: "manufacturer", value: manufacturer };
    try {
      const cars = await carModel.getByFilter(status, filter);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: `No car exist with manufacturer: ${manufacturer}, manufacturer is case sensitive`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getCarsByPriceRange(req, res) {
    const { status, min_price, max_price } = req.query;
    try {
      const cars = await carModel.getByPrice(status, min_price, max_price);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: `No car exist with price between ${min_price} and ${max_price}`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getCarsByBodyType(req, res) {
    const { status, body_type } = req.query;
    const filter = { name: "body_type", value: body_type };
    try {
      const cars = await carModel.getByFilter(status, filter);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: `No car exist with body type: ${body_type}, body_type is case sensitive`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }

  static async getUserCars(req, res) {
    const { id: userId } = req.body.tokenPayload;
    try {
      const cars = await carModel.getByOwner(userId);
      if (cars) {
        return res.status(200).json({ status: 200, data: cars });
      }
      return res.status(404).json({
        status: 404,
        error: "No cars found"
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal server error" });
    }
  }
}

export default CarController;
