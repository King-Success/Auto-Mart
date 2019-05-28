import Helpers from '../helpers';
import carModel from '../models/cars';
import authValidator from './authValidator';

const { extractErrors } = Helpers;

class CarValidator {
  static validateCar(req, res, next) {
    req.checkBody('state', 'Car state is required').notEmpty().trim().isAlpha()
    .withMessage('Car state can only contain alphabets');
    req.checkBody('price', 'Car price is required').notEmpty().isFloat()
      .withMessage('Car price must contain decimal point');
    req.checkBody('manufacturer', 'Car manufacturer is required').notEmpty().trim()
    req.checkBody('model', 'Car model is required').notEmpty().trim()
    req.checkBody('bodyType', 'Car body type is required').notEmpty()
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }
}
export default CarValidator;
