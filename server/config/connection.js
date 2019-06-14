import { Pool } from 'pg';
import dbConfig from './dbConfig';

const connectionString = dbConfig.db;
const pool = new Pool({
  connectionString,
});


export default pool;
