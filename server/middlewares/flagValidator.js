import Helpers from '../helpers';

const { extractErrors } = Helpers;

class FlagValidator {
  static validateFlag(req, res, next) {
    req.checkBody('car_id', 'car_id is required').notEmpty().trim();
    req.checkBody('reason', 'reason is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }
}
export default FlagValidator;
