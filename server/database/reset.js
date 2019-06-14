import debug from 'debug';
import pool from '../config/connection';

const debugg = debug('migrate:reset');

(async function reset() {
  const client = await pool.connect();
  try {
    debugg('rolling back migrations...');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS cars CASCADE');
    await client.query('DROP TABLE IF EXISTS orders CASCADE');
    await client.query('DROP TABLE IF EXISTS flags CASCADE');
  } catch (err) {
    debugg(err);
    return;
  } finally {
    await client.release();
    debugg('roll back completed');
  }
  debugg('Exiting...');
}());
