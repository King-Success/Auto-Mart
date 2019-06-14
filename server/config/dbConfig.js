import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  db: process.env.DB_URL,
  env: process.env.NODE_ENV || 'development',
};

export default dbConfig;
