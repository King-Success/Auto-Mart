import Helpers from '../helpers';
import OrderModel from '../models/order'

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

    static isOrderOwner(req, res, next) {
        const { id: buyerId } = req.body.tokenPayload;
        const { orderId } = req.params;
        try {
          const order = OrderModel.find(odr => odr.id === orderId);
          if (order) {
            if (order.buyer === buyerId) {
              return next();
            }
            return res.status(400).json({ status: 400, errors: 'Permission denied, you can only update price of orders you made' });
          }
          return res.status(400).json({ status: 400, errors: `Order with id: ${orderId} does not exist` });
        } catch (error) {
            console.log(error)
          return res.status(500).json({ status: 500, errors: 'Internal server error' });
        }
      }

      static validateAmount(req, res, next) {
        req.checkBody('amount', 'Order amount is required').notEmpty().trim().isCurrency({ allow_negatives: false, require_decimal: true })
        .withMessage('Order amount must be a valid number in two decimal place, e.g 123000.00');
    
        const errors = req.validationErrors();
        if (errors) {
          return res.status(400).json({ status: 400, errors: extractErrors(errors) });
        }
        return next();
      }
}
export default OrderValidator;
