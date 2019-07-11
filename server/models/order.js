import pool from '../config/connection';

class Order {
  static async create(values) {
    const client = await pool.connect();
    let order;
    const text = `INSERT INTO orders(buyer, car_id, amount)
      VALUES($1, $2, $3) RETURNING id, buyer, car_id, amount, status, created_on`;
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

  static async getById(id) {
    const values = [id];
    const client = await pool.connect();
    let order;
    const text = 'SELECT * FROM orders WHERE id = $1 LIMIT 1';
    try {
      order = await client.query({ text, values });
      if (order.rows && order.rowCount) {
        order = order.rows[0];
        return order;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const values = [data.value, id];
    const client = await pool.connect();
    let order;
    const text = `UPDATE orders SET ${data.name} = $1 WHERE id = $2 RETURNING *`;
    try {
      order = await client.query({ text, values });
      if (order.rowCount) {
        return order.rows[0];
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
}
export default Order;
