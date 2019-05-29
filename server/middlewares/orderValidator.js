import Helpers from '../helpers';

const { extractErrors } = Helpers;

class OrderValidator {
    static validateOrder(req, res, next) {
        req.checkBody('carId', 'Car Id is required').notEmpty().trim().isString()
            .withMessage('Car Id must be a string');
        req.checkBody('amount', 'Order amount is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: true })
            .withMessage('Order amount must be a valid number in two decimal place, e.g 123000.00');

        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({ status: 400, errors: extractErrors(errors) });
        }
        return next();
    }
}
export default OrderValidator;
