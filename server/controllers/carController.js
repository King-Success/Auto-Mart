import shortId from 'shortid';
import carModel from '../models/cars';

class CarController {
  /**
           *
           * @param {object} req - request
           * @param {object} res - response
           */
  static async createCarAd(req, res) {
    /* istanbul ignore next */
    const id = shortId.generate();
    const status = 'available';
    const createdOn = new Date();
    try {
      const { id: owner } = req.body.tokenPayload;
      const { state, price, manufacturer, model, bodyType } = req.body;
      const car = {
        id, owner, createdOn, state, status, price, manufacturer, model, bodyType,
      };
      carModel.push(car);
      return res.status(201).json({
        status: 201,
        data: [car],
        message: 'Car Ad created successfully',
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }

  static async updateCarAdStatus(req, res) {
    const { carId } = req.params;
    const { status } = req.body;
    try {
      let car = carModel.find(car => car.id === carId);
      car = { status, ...car };
      for (let i = 0; i < carModel.length; i += 1) {
        if (carModel[i].id === carId) {
          carModel.splice(i, 1);
          carModel.push(car);
          return res.status(200).json({
            status: 200,
            data: [car],
            message: 'Car Ad updated successfully',
          });
        }
      }
      return res.status(500).json({ status: 500, error: 'Oops, something happend, try again' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    }
  }

  static async updateCarAdPrice(req, res) {
    const { carId } = req.params;
    const { price } = req.body;
    try {
      let car = carModel.find(car => car.id === carId);
      car = { ...car, price };
      for (let i = 0; i < carModel.length; i += 1) {
        if (carModel[i].id === carId) {
          carModel.splice(i, 1);
          carModel.push(car);
          return res.status(200).json({
            status: 200,
            data: [car],
            message: 'Car Ad updated successfully',
          });
        }
      }
      return res.status(500).json({ status: 500, error: 'Oops, something happend, try again' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    }
  }

  static async getACar(req, res) {
    const { carId } = req.params;
    try {
      const car = carModel.find(car => car.id === carId);
      if (car) {
        return res.status(200).json({ status: 200, data: [car] });
      }
      return res.status(404).json({
        status: 404,
        error: `Car with id: ${carId} does not exist`,
      });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }

}

export default CarController;
