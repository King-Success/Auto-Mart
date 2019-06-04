import express from 'express';
import AuthController from '../controllers/authController';
import AuthValidator from '../middlewares/authValidator';
import CarController from '../controllers/carController';
import CarValidator from '../middlewares/carValidator';
import OrderValidator from '../middlewares/orderValidator';
import OrderController from '../controllers/orderController';
import swagger from 'swagger-ui-express';
import helpers from '../helpers'

const docs = require('../../swagger.json')

const router = express.Router();

const { createAccount, loginUser } = AuthController;
const { validateSignUp, userExists, validateLogin, isTokenValid, isAdmin } = AuthValidator;
const { createCarAd, updateCarAdStatus, updateCarAdPrice,
  getACar, getAllCars, deleteCarAd } = CarController;
const { validateCar, isCarExist, isCarOwner, validateStatus,
  validatePrice, validateParams } = CarValidator;
const { validateOrder, isOrderOwner, validateAmount } = OrderValidator;
const { createOrder, updateOrderPrice } = OrderController;

router.get('/', (req, res) => {
  res.send(helpers.apiLandingPage());
})

// Documentaion 
router.use('/api/docs', swagger.serve);
router.get('/api/docs', swagger.setup(docs));

// 404 Routes
router.get('*', (req, res, next) => {
  res.status(404).json({
    message: 'Invalid Endpoint',
  });
  return next();
});

// Auth routes
const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);

// Car routes
const carBaseUrl = '/api/v1/car';
router.post(`${carBaseUrl}`, isTokenValid, validateCar, createCarAd);
router.patch(`${carBaseUrl}/:carId/status`, isTokenValid, isCarExist, isCarOwner, validateStatus, updateCarAdStatus);
router.patch(`${carBaseUrl}/:carId/price`, isTokenValid, isCarExist, isCarOwner, validatePrice, updateCarAdPrice);
router.get(`${carBaseUrl}/:carId`, isTokenValid, getACar);
router.get(`${carBaseUrl}`, isTokenValid, validateParams, getAllCars);
router.delete(`${carBaseUrl}/:carId`, isTokenValid, isAdmin, deleteCarAd);

// Order routes
const orderBaseUrl = '/api/v1/order';
router.post(`${orderBaseUrl}`, isTokenValid, validateOrder, isCarExist, createOrder);
router.patch(`${orderBaseUrl}/:orderId/price`, isTokenValid, isOrderOwner, validateAmount, updateOrderPrice);

export default router;
