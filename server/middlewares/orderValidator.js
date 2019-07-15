import Helpers from '../helpers';
import OrderModel from '../models/order';

const { extractErrors } = Helpers;

class OrderValidator {
  static validateOrder(req, res, next) {
    req.checkBody('car_id', 'car_id is required').notEmpty().trim();
    req.checkBody('amount', 'amount is required').notEmpty()
      .isCurrency({ allow_negatives: false, require_decimal: false })
      .withMessage('amount must be a valid number');

    const errors = req.validationErrors();
    if (errors) {
      // console.log('order valid', errors);
      return res.status(400).json({ status: 400, error: extractErrors(errors) });
    }
    return next();
  }

  static async isOrderOwner(req, res, next) {
    const { id: buyerId } = req.body.tokenPayload;
    const { orderId } = req.params;
    try {
      const order = await OrderModel.getById(orderId);
      if (order) {
        if (order.buyer === buyerId) {
          return next();
        }
        return res.status(400).json({ status: 400, errors: 'Permission denied, you can only update price of orders you made' });
      }
      return res.status(400).json({ status: 400, errors: `Order with id: ${orderId} does not exist` });
    } catch (error) {
      return res.status(500).json({ status: 500, errors: 'Internal server error' });
    }
  }

  static validateAmount(req, res, next) {
    req.checkBody('price', 'price is required').notEmpty().isCurrency({ allow_negatives: false, require_decimal: false })
      .withMessage('price must be a valid number');

    const errors = req.validationErrors();
    if (errors) {
      console.log('price valid', errors);
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    return next();
  }
}
export default OrderValidator;
