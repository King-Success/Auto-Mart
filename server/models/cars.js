import pool from '../config/connection';

class Car {
  static async create(values) {
    const client = await pool.connect();
    let car;
    const text = `INSERT INTO cars(owner,state, price, manufacturer, model, bodyType, mainImageUrl)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    try {
      car = await client.query({ text, values });
      if (car.rowCount) {
        car = car.rows[0];
        return car;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      await client.release();
    }
  }
}
export default Car;
