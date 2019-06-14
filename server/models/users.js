import pool from '../config/connection';

class User {
  static async create(values) {
    const client = await pool.connect();
    let user;
    const text = `INSERT INTO users(firstname, lastname, email, password, phone, address)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING id, firstname, lastname, email, isAdmin, phone, passportUrl, address, createdOn`;
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
}
export default User;
