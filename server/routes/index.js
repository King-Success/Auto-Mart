import express from "express";
import swagger from "swagger-ui-express";
import AuthController from "../controllers/authController";
import AuthValidator from "../middlewares/authValidator";
import CarController from "../controllers/carController";
import CarValidator from "../middlewares/carValidator";
import OrderValidator from "../middlewares/orderValidator";
import OrderController from "../controllers/orderController";
import FlagController from "../controllers/flagController";
import FlagValidator from "../middlewares/flagValidator";
import helpers from "../helpers";

const docs = require("../../swagger.json");

const router = express.Router();

const {
  createAccount,
  getAccount,
  loginUser,
  resetPassword,
  resetPasswordForm,
  passwordResetEmail,
  validateToken
} = AuthController;
const {
  validateSignUp,
  userExists,
  validateLogin,
  isTokenValid,
  isAdmin
} = AuthValidator;
const {
  createCarAd,
  updateCarAdStatus,
  updateCarAdPrice,
  getACar,
  getAllCars,
  deleteCarAd,
  getCarsByStatus,
  getCarsByState,
  getCarsByManufacturer,
  getCarsByPriceRange,
  getCarsByBodyType,
  getUserCars
} = CarController;
const {
  validateCar,
  isCarExist,
  isCarOwner,
  validateStatus,
  validatePrice,
  validateParams
} = CarValidator;
const { validateOrder, isOrderOwner } = OrderValidator;
const { createOrder, updateOrderAmount } = OrderController;
const { createFlag } = FlagController;
const { validateFlag } = FlagValidator;

router.get("/", (req, res) => {
  res.send(helpers.apiLandingPage());
});

// Documentaion
router.use("/api/docs", swagger.serve);
router.get("/api/docs", swagger.setup(docs));

// Auth routes
const authBaseUrl = "/api/v1/auth";
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/signin`, validateLogin, loginUser);
router.post(`${authBaseUrl}/validateToken`, validateToken);

// Password reset routes
const passwordResetBaseUrl = "/api/v1/users";
router.post(`${passwordResetBaseUrl}/:email/resetPassword`, passwordResetEmail);
router.get(`${passwordResetBaseUrl}/reset/:token`, resetPasswordForm);
router.post(`${passwordResetBaseUrl}/reset`, resetPassword);

// Car routes
const carBaseUrl = "/api/v1/car";
router.post(`${carBaseUrl}`, isTokenValid, validateCar, createCarAd);
router.get(`${carBaseUrl}`, isTokenValid, getAllCars);
// router.get(`${carBaseUrl}/history`, isTokenValid, getUserCars);
router.patch(
  `${carBaseUrl}/:carId/status`,
  isTokenValid,
  isCarExist,
  isCarOwner,
  validateStatus,
  updateCarAdStatus
);
router.patch(
  `${carBaseUrl}/:carId/price`,
  isTokenValid,
  isCarExist,
  isCarOwner,
  validatePrice,
  updateCarAdPrice
);
// router.get(
//   `${carBaseUrl}/getByStatus`,
//   isTokenValid,
//   validateParams,
//   getCarsByStatus
// );
// router.get(
//   `${carBaseUrl}/getByState`,
//   isTokenValid,
//   validateParams,
//   getCarsByState
// );
// router.get(
//   `${carBaseUrl}/getByManufacturer`,
//   isTokenValid,
//   validateParams,
//   getCarsByManufacturer
// );
// router.get(
//   `${carBaseUrl}/getByPrice`,
//   isTokenValid,
//   validateParams,
//   getCarsByPriceRange
// );
// router.get(
//   `${carBaseUrl}/getByBodyType`,
//   isTokenValid,
//   validateParams,
//   getCarsByBodyType
// );
router.get(`${carBaseUrl}/:carId`, isTokenValid, getACar);
router.delete(`${carBaseUrl}/:carId`, isTokenValid, isAdmin, deleteCarAd);

// Order routes
// const orderBaseUrl = "/api/v1/order";
// router.post(
//   `${orderBaseUrl}`,
//   isTokenValid,
//   validateOrder,
//   isCarExist,
//   createOrder
// );
// router.patch(
//   `${orderBaseUrl}/:orderId/price`,
//   isTokenValid,
//   isOrderOwner,
//   validatePrice,
//   updateOrderAmount
// );

// // Flag route
// const flagBaseUrl = "/api/v1/flag";
// router.post(
//   `${flagBaseUrl}`,
//   isTokenValid,
//   validateFlag,
//   isCarExist,
//   createFlag
// );

// // User route
// const userBaseUrl = "/api/v1/user";
// router.get(`${userBaseUrl}/:userId`, isTokenValid, getAccount);

export default router;
