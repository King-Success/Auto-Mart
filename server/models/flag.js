import pool from '../config/connection';

class Flag {
  static async create(values) {
    const client = await pool.connect();
    let flag;
    const text = `INSERT INTO flags(car_id, reason, description)
      VALUES($1, $2, $3) RETURNING *`;
    try {
      flag = await client.query({ text, values });
      if (flag.rowCount) {
        flag = flag.rows[0];
        return flag;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      await client.release();
    }
  }
}
export default Flag;
