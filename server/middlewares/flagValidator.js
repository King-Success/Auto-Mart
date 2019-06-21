import Helpers from '../helpers';

const { extractErrors } = Helpers;

class FlagValidator {
  static validateFlag(req, res, next) {
    req.checkBody('carId', 'Car Id is required').notEmpty().trim();
    req.checkBody('reason', 'Reason is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }
}
export default FlagValidator;
