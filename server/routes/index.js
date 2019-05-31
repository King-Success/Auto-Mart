import express from 'express';
import AuthController from '../controllers/authController';
import AuthValidator from '../middlewares/authValidator';
import CarController from '../controllers/carController';
import CarValidator from '../middlewares/carValidator';
import OrderValidator from '../middlewares/orderValidator';
import OrderController from '../controllers/orderController';


const router = express.Router();

const { createAccount, loginUser } = AuthController;
const { validateSignUp, userExists, validateLogin, isTokenValid } = AuthValidator;
const { createCarAd, updateCarAdStatus, updateCarAdPrice, getACar, getAllCars } = CarController;
const { validateCar, isCarExist, isCarOwner, validateStatus, validatePrice, validateParams } = CarValidator;
const { validateOrder, isOrderOwner, validateAmount } = OrderValidator;
const { createOrder, updateOrderPrice } = OrderController;

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

// Order routes
const orderBaseUrl = '/api/v1/order';
router.post(`${orderBaseUrl}`, isTokenValid, validateOrder, isCarExist, createOrder);
router.patch(`${orderBaseUrl}/:orderId/price`, isTokenValid, isOrderOwner, validateAmount, updateOrderPrice);

export default router;
