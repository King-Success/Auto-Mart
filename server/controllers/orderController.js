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
    const { price } = req.body;
    const data = { name: "amount", value: price };
    try {
      const oldOrder = await orderModel.getById(orderId);
      const order = await orderModel.update(orderId, data);
      if (order) {
        const old_price_offered = oldOrder.new_price_offered || oldOrder.amount;
        const data = { ...order, old_price_offered, new_price_offered: price };
        return res.status(200).json({
          status: 200,
          data
        });
      }
      return res.status(400).json({
        status: 404,
        error: `Car order with id: ${orderId} does not exist`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server error" });
    }
  }
}

export default OrderController;
