import express from 'express';
import AuthController from '../controllers/authController';
import AuthValidator from '../middlewares/authValidator';
import CarController from '../controllers/carController';
import CarValidator from '../middlewares/carValidator';


const router = express.Router();

const { createAccount, loginUser } = AuthController;
const { validateSignUp, userExists, validateLogin, isTokenValid } = AuthValidator;
const { createCarAd } = CarController;
const { validateCar } = CarValidator;

// Auth routes
const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);

// Car routes
const carBaseUrl = '/api/v1/car';
router.post(`${carBaseUrl}`, isTokenValid, validateCar, createCarAd);

export default router;
