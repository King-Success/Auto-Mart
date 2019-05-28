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
}

export default CarController;
