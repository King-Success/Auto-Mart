import carModel from '../models/cars';
import Helper from '../helpers/index'
class CarController {

  static async createCarAd(req, res) {
    try {
      const { id: owner } = req.body.tokenPayload;
      const { state, price, manufacturer, model, bodyType, mainImageUrl } = req.body;
      const values = [owner, state, price, manufacturer, model, bodyType, mainImageUrl];
      const car = await carModel.create(values);
      if (car) {
        return res.status(201).json({
          status: 201,
          data: [car],
          message: 'Car Ad created successfully',
        });
      }
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }

  static async updateCarAdStatus(req, res) {
    const { carId } = req.params;
    const { status } = req.body;
    const data = { name: 'status', value: status };
    try {
      const car = await carModel.update(carId, data);
      if (car) {
        return res.status(200).json({
          status: 200,
          data: [car],
          message: 'Car Ad updated successfully',
        });
      }
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
      Helper.updateModel(req, res, carModel, car, carId, 'Car')
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

  static async getAllCars(req, res) {
    try {
      const cars = await carModel.getAll();
      if (cars) {
        return res.status(200).json({ status: 200, data: [cars] });
      }
      return res.status(404).json({
        status: 404,
        error: 'No car exist',
      });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }

  static async deleteCarAd(req, res) {
    const { carId } = req.params;
    try {
      for (let i = 0; i < carModel.length; i += 1) {
        if (carModel[i].id === carId) {
          carModel.splice(i, 1);
          return res.status(200).json({
            status: 204,
            data: [],
            message: 'Car Ad deleted successfully',
          });
        }
      }
      return res.status(404).json({ status: 404, message: `Car with id: ${carId} not found` });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    }
  }
}

export default CarController;
