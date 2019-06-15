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

  static async updateOrderAmount(req, res) {
    const { orderId } = req.params;
    const { amount } = req.body;
    const data = { name: 'amount', value: amount };
    try {
      const order = await orderModel.update(orderId, data);
      if (order) {
        return res.status(200).json({
          status: 200,
          data: [order],
          message: 'Car order updated successfully',
        });
      }
      return res.status(500).json({ status: 404, error: `Car order with id: ${orderId} does not exist` });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    }
  }
}

export default OrderController;
