import express from 'express';
import AuthController from '../controllers/authController';
import AuthValidator from '../middlewares/authValidator';

const router = express.Router();

const { createAccount } = AuthController;
const { validateSignUp, userExists } = AuthValidator;

// Auth routes
const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);

export default router;
