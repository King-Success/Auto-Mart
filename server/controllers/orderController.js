import shortId from 'shortid';
import orderModel from '../models/order';

class OrderController {
  /**
     *
     * @param {object} req - request
     * @param {object} res - response
     */
  static async createOrder(req, res) {
    /* istanbul ignore next */
    const id = shortId.generate();
    const status = 'pending';
    const createdOn = new Date();
    try {
      const { id: buyer } = req.body.tokenPayload;
      const { carId, amount } = req.body;
      const order = {
        id, buyer, carId, amount, status, createdOn,
      };
      orderModel.push(order);
      return res.status(201).json({
        status: 201,
        data: order,
        message: 'Order created successfully',
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }
}

export default OrderController;
