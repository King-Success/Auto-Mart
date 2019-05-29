import Helpers from '../helpers';
import carModel from '../models/cars';

const { extractErrors } = Helpers;

class CarValidator {
  static validateCar(req, res, next) {
    req.checkBody('state', 'Car state is required').notEmpty().trim().isAlpha()
      .withMessage('Car state can only contain alphabets');
    req.checkBody('price', 'Car price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
    .withMessage('Car price must be a valid number in two decimal place, e.g 123000.00');
    req.checkBody('manufacturer', 'Car manufacturer is required').notEmpty().trim();
    req.checkBody('model', 'Car model is required').notEmpty().trim();
    req.checkBody('bodyType', 'Car body type is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static isCarExist(req, res, next) {
    const carId = req.params.carId || req.body.carId;
    try {
      const car = carModel.find(cr => cr.id === carId);
      if (!car) {
        return res.status(404).json({ status: 404, error: `Car Ad with id: ${carId} does not exist` });
      }
      next();
    } catch (error) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }
}
export default CarValidator;
