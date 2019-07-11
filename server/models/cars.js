import pool from '../config/connection';

class Car {
  static async create(values) {
    const client = await pool.connect();
    let car;
    const text = `INSERT INTO cars(owner,state, price, manufacturer, model, body_type, main_image_url)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, owner, state, status, price, manufacturer, model, body_type, main_image_url, created_on`;
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

  static async getByStatus(status) {
    const values = [status];
    const client = await pool.connect();
    let cars;
    const text = 'SELECT * FROM cars WHERE status = $1';
    try {
      cars = await client.query({ text, values });
      if (cars.rows && cars.rowCount) {
        cars = cars.rows;
        return cars;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async getByFilter(status, filter) {
    const values = [status, filter.value];
    const client = await pool.connect();
    let car;
    const text = `SELECT * FROM cars WHERE status = $1 AND ${filter.name} = $2`;
    try {
      car = await client.query({ text, values });
      if (car.rows && car.rowCount) {
        car = car.rows;
        return car;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async getByPrice(status, minPrice, maxPrice) {
    const values = [status, minPrice, maxPrice];
    const client = await pool.connect();
    let car;
    const text = 'SELECT * FROM cars WHERE status = $1 AND price BETWEEN $2 AND $3';
    try {
      car = await client.query({ text, values });
      if (car.rows && car.rowCount) {
        car = car.rows;
        return car;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async getByOwner(owner) {
    const values = [owner];
    const client = await pool.connect();
    let car;
    const text = 'SELECT * FROM cars WHERE owner = $1';
    try {
      car = await client.query({ text, values });
      if (car.rows && car.rowCount) {
        car = car.rows;
        return car;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const values = [id];
    const client = await pool.connect();
    let car;
    const text = 'DELETE FROM cars WHERE id = $1 RETURNING id';
    try {
      car = await client.query({ text, values });
      if (car.rowCount) {
        return true;
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
