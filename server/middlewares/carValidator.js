import Helpers from '../helpers';
import carModel from '../models/cars';
import authValidator from './authValidator';

const { extractErrors } = Helpers;

class CarValidator {
  static validateCar(req, res, next) {
    req.checkBody('state', 'Car state is required').notEmpty().trim().isAlpha()
      .withMessage('Car state can only contain alphabets')
      .isIn(['New', 'Used'])
      .withMessage('Car state must be either New or Used, notice the uppercase');
    req.checkBody('price', 'Car price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
      .withMessage('Car price must be a valid number in two decimal place, e.g 123000.00');
    req.checkBody('manufacturer', 'Car manufacturer is required').notEmpty().trim();
    req.checkBody('model', 'Car model is required').notEmpty().trim();
    req.checkBody('bodyType', 'Car body type is required').notEmpty();
    req.checkBody('mainImageUrl', 'Car main image url is required').notEmpty().isString()
      .withMessage('Car main image url must be a string');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static async isCarExist(req, res, next) {
    const carId = req.params.carId || req.body.carId;
    try {
      const car = await carModel.getById(carId);
      if (!car) {
        return res.status(404).json({ status: 404, error: `Car Ad with id: ${carId} does not exist` });
      }
      next();
    } catch (error) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }

  static async isCarOwner(req, res, next) {
    const { id: ownerId } = req.body.tokenPayload;
    const { carId } = req.params;
    try {
      const car = await carModel.getById(carId);
      if (car) {
        if (car.owner === ownerId) {
          return next();
        }
        return res.status(401).json({ status: 401, error: 'Permission denied, you can only update Ads posted by you' });
      }
      return res.status(404).json({ status: 404, error: `Car Ad with id: ${carId} does not exist` });
    } catch (error) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }

  static validateStatus(req, res, next) {
    req.checkBody('status', 'Car status is required').notEmpty().trim().isIn(['Sold', 'Available'])
      .withMessage('Car status can only be Sold or Available, notice the uppercase')
      .isString()
      .withMessage('Car status must be a string');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static validatePrice(req, res, next) {
    req.checkBody('price', 'Car price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
      .withMessage('Car price must be a valid number in two decimal place, e.g 123000.00');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static validateParams(req, res, next) {
    const keys = Object.keys(req.query);
    const allowedStatuses = ['Available', 'Sold'];
    const allowedStates = ['New', 'Used'];
    let error;
    if (keys.length === 0) {
      return authValidator.isAdmin(req, res, next);
    }
    keys.forEach((key) => {
      switch (key) {
        case 'status':
          if (!allowedStatuses.includes(req.query[key])) error = 'status must either be Sold or Availble, notice the uppercase';
          break;
        case 'minPrice':
          req.checkQuery('maxPrice', 'There must also be a maxPrice').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
            .withMessage('Maximum price must be a valid number in two decimal place, e.g 123000.00');
          error = req.validationErrors()[0];
          break;
        case 'maxPrice':
          req.checkQuery('minPrice', 'There must also be a minPrice').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
            .withMessage('Minimum price must be a valid number in two decimal place, e.g 123000.00');
          error = req.validationErrors()[0];
          break;
        case 'state':
          if (!allowedStates.includes(req.query[key])) error = 'state must either be Used or New, notice the uppercase';
          break;
        case 'manufacturer':
          break;
        case 'bodyType':
          break;
        default:
          error = 'Invalid filter provided';
      }
    });
    if (error) {
      return res.status(400).json({ status: 400, error: error.msg || error });
    }
    next();
  }
}
export default CarValidator;
