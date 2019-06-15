import pool from '../config/connection';

class Order {
  static async create(values) {
    const client = await pool.connect();
    let order;
    const text = `INSERT INTO orders(buyer, carId, amount)
      VALUES($1, $2, $3) RETURNING *`;
    try {
      order = await client.query({ text, values });
      if (order.rowCount) {
        order = order.rows[0];
        return order;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      await client.release();
    }
  }
}
export default Order;
