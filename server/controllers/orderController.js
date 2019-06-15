import orderModel from '../models/order';

class OrderController {

  static async createOrder(req, res) {
    try {
      const { id: buyer } = req.body.tokenPayload;
      const { carId, amount } = req.body;
      const values = [buyer, carId, amount];
      const order = await orderModel.create(values);
      if (order) {
        return res.status(201).json({
          status: 201,
          data: [order],
          message: 'Car order created successfully',
        });
      }
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }

  static async updateOrderPrice(req, res) {
    try {
      const { orderId } = req.params;
      const { amount } = req.body;
      let order = orderModel.find(order => order.id === orderId);
      if (!order) {
        return res.status(400).json({ status: 400, message: `Purchase order with id: ${orderId} does not exist` });
      }
      order = { ...order, amount };
      Helper.updateModel(req, res, orderModel, order, orderId, 'Order')
      return res.status(500).json({ status: 500, error: 'Oops, something happend, try again' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    }
  }
}

export default OrderController;
