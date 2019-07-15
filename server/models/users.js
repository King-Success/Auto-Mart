import pool from '../config/connection';

class User {
  static async create(values) {
    const client = await pool.connect();
    let user;
    const text = `INSERT INTO users(first_name, last_name, email, password, phone, address)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, is_admin, phone, passport_url, address, created_on`;
    try {
      user = await client.query({ text, values });
      if (user.rowCount) {
        user = user.rows[0];
        return user;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      await client.release();
    }
  }

  static async findByEmail(email) {
    const values = [email];
    const client = await pool.connect();
    let user;
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      user = await client.query({ text, values });
      if (user.rows && user.rowCount) {
        user = user.rows[0];
        return user;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const values = [id];
    const client = await pool.connect();
    let user;
    const text = 'SELECT * FROM users WHERE id = $1';
    try {
      user = await client.query({ text, values });
      if (user.rows && user.rowCount) {
        user = user.rows[0];
        return user;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  static async updateByEmail(email, data) {
    const values = [data.value, email];
    const client = await pool.connect();
    let car;
    const text = `UPDATE users SET ${data.name} = $1 WHERE email = $2 RETURNING *`;
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
export default User;
