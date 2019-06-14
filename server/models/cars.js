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

  static async getAll() {
    const client = await pool.connect();
    let cars;
    const text = 'SELECT * FROM cars';
    try {
      cars = await client.query({ text });
      if (cars.rows && cars.rowCount) {
        return cars.rows;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const values = [id];
    const client = await pool.connect();
    let car;
    const text = 'SELECT * FROM cars WHERE id = $1 LIMIT 1';
    try {
      car = await client.query({ text, values });
      if (car.rows && car.rowCount) {
        car = car.rows[0];
        return car;
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
    let car;
    const text = `UPDATE cars SET ${data.name} = $1 WHERE id = $2 RETURNING *`;
    try {
      car = await client.query({ text, values });
      if (car.rowCount) {
        return car.rows[0];
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
}
export default Car;
