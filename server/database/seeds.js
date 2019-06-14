import passwordHash from 'password-hash';
import debug from 'debug';
import pool from '../config/connection';

const debugg = debug('seed');

const password = passwordHash.generate('secret');

const userA = `INSERT INTO users(firstname, lastname, email, phone, password, address)
                  VALUES('Edwin', 'Diaz', 'diz.user@gmail.com', '09098878767', '${password}', '101 str, Ajao Estate, Lagos, Nigeria')`;


const userB = `INSERT INTO users(firstname, lastname, email, phone, password, address)
VALUES('Elon', 'Musk', 'elon.user@gmail.com', '09096678767', '${password}', '101 str, Ikeja GRA, Lagos, Nigeria')`;

const admin = `INSERT INTO users(firstname, lastname, isAdmin, email, phone, password, address)
                  VALUES('Kingsley', 'Arinze', true, 'kingsley.admin@gmail.com', '07066554435', '${password}', '707 str, Martins Estate, Lagos, Nigeria')`;

const carA = `INSERT INTO cars(owner, state, price, manufacturer, model, bodyType, mainImageUrl)
                    VALUES(1, 'New', 6500000.00, 'Tesla', 'model S', 'car', 'https://res.cloudinary.com/drjpxke9z/image/upload/v1549984207/pdp_nucvwu.jpg')`;

const carB = `INSERT INTO cars(owner, state, price, manufacturer, model, bodyType, mainImageUrl)
VALUES(1, 'Used', 1500000.00, 'Toyota', 'Avalon 2006', 'car', 'https://res.cloudinary.com/drjpxke9z/image/upload/v1549984207/pdp_nucvwu.jpg')`;

const order = `INSERT INTO orders(buyer, carId, amount)
                      VALUES(2, 1, 6000000.00)`;

const flag = `INSERT INTO flags(carId, reason, description)
                        VALUES(2, 'Fake images', 'The images being displayed are not original images of the vehicle')`;

(async function seed() {
  const client = await pool.connect();
  debugg('seeding database...');
  try {
    await client.query(userA);
    await client.query(userB);
    await client.query(admin);
    await client.query(carA);
    await client.query(carB);
    await client.query(order);
    await client.query(flag);
  } catch (err) {
    return;
  } finally {
    await client.release();
    debugg('seeding completed');
  }
  debugg('Exiting...');
}());
