import Helpers from '../helpers';
import carModel from '../models/cars';
import authValidator from './authValidator';

const { extractErrors } = Helpers;

class CarValidator {
  static validateCar(req, res, next) {
    req.checkBody('state', 'state is required').notEmpty().trim().isAlpha()
      .withMessage('state can only contain alphabets')
      .isIn(['new', 'used'])
      .withMessage('state must be either new or used');
    req.checkBody('price', 'price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: false })
      .withMessage('price must be a valid number');
    req.checkBody('manufacturer', 'manufacturer is required').notEmpty().trim();
    req.checkBody('model', 'model is required').notEmpty().trim();
    req.checkBody('body_type', 'body_type is required').notEmpty();
    req.checkBody('main_image_url', 'main_image_url is required').notEmpty().isString()
      .withMessage('main_image_url must be a string');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static async isCarExist(req, res, next) {
    const carId = req.params.carId || req.body.car_id;
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
    req.checkBody('status', 'status is required').notEmpty().trim().isIn(['sold', 'available'])
      .withMessage('status can only be sold or available')
      .isString()
      .withMessage('status must be a string');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static validatePrice(req, res, next) {
    req.checkBody('price', 'price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: false })
      .withMessage('price must be a valid number');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }

  static validateParams(req, res, next) {
    const keys = Object.keys(req.query);
    const allowedStatuses = ['available', 'sold'];
    const allowedStates = ['new', 'used'];
    let error;
    if (keys.length === 0) {
      return authValidator.isAdmin(req, res, next);
    }
    keys.forEach((key) => {
      switch (key) {
        case 'status':
          if (!allowedStatuses.includes(req.query[key])) error = 'status must either be sold or availble';
          break;
        case 'min_price':
          req.checkQuery('max_price', 'There must also be a max_price').notEmpty().isCurrency({ allow_negatives: false, require_decimal: false })
            .withMessage('max_price must be a valid number');
          error = req.validationErrors()[0];
          break;
        case 'max_price':
          req.checkQuery('min_price', 'There must also be a min_price').notEmpty().isCurrency({ allow_negatives: false, require_decimal: false })
            .withMessage('Minimum price must be a valid number');
          error = req.validationErrors()[0];
          break;
        case 'state':
          if (!allowedStates.includes(req.query[key])) error = 'state must either be used or new';
          break;
        case 'manufacturer':
          break;
        case 'body_type':
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
