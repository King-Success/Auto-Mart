const users = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    passportUrl VARCHAR(200) DEFAULT NULL,
    address VARCHAR(200) DEFAULT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

const cars = `CREATE TABLE IF NOT EXISTS cars(
    id SERIAL PRIMARY KEY,
    owner INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    state VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT('Available'),
    price Numeric(12, 2) NOT NULL,
    manufacturer VARCHAR(200) NOT NULL,
    model VARCHAR(200) NOT NULL,
    body_type VARCHAR(200) NOT NULL,
    main_image_url VARCHAR(200) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

const orders = `CREATE TABLE IF NOT EXISTS orders(
    id SERIAL PRIMARY KEY,
    buyer INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE ON UPDATE CASCADE,
    amount Numeric(12, 2) NOT NULL,
    status VARCHAR(100) DEFAULT('pending'),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

const flags = `CREATE TABLE IF NOT EXISTS flags(
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE ON UPDATE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

export default {
  users,
  cars,
  orders,
  flags,
};
