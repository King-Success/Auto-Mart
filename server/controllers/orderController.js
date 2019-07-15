import orderModel from "../models/order";
import carModel from "../models/cars";

class OrderController {
  static async createOrder(req, res) {
    try {
      const { id: buyer } = req.body.tokenPayload;
      const { car_id, amount } = req.body;
      const values = [buyer, car_id, amount];
      const order = await orderModel.create(values);
      const car = await carModel.getById(car_id);
      if (order) {
        const { amount: price_offered } = order;
        const { price } = car;
        delete order.amount;
        delete order.buyer;
        const data = { ...order, price, price_offered };
        return res.status(201).json({
          status: 201,
          data
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }

  static async updateOrderAmount(req, res) {
    const { orderId } = req.params;
    const { price: amount } = req.body;
    const data = { name: "amount", value: amount };
    try {
      const oldOrder = await orderModel.getById(orderId);
      const order = await orderModel.update(orderId, data);
      if (order) {
        const { amount: old_price_offered } = oldOrder;
        const { amount: new_price_offered } = order;
        delete order.amount;
        delete order.buyer;
        const data = { ...order, old_price_offered, new_price_offered };
        return res.status(200).json({
          status: 200,
          data
        });
      }
      console.log('order does not exit', order);
      return res.status(400).json({
        status: 404,
        error: `Car order with id: ${orderId} does not exist`
      });
    } catch (err) {
      console.log('order update price server error', err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server error" });
    }
  }
}

export default OrderController;
