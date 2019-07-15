import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Helpers from "../helpers";
import Auth from "../helpers/auth";
import UserModel from "../models/users";

const SECRET = process.env.SECRET || "SuperSecretTokenKeyXXX&*&";
const { verifyToken } = Auth;
const { extractErrors } = Helpers;
dotenv.config();

/* istanbul ignore next */
/**
 * @description Handles validation for all authentication processes
 */
class AuthValidator {
  /**
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  static validateSignUp(req, res, next) {
    req
      .check("first_name", "first_name is required")
      .notEmpty()
      .trim()
      .isAlpha()
      .withMessage("first_name can only contain alphabets");
    req
      .check("last_name", "last_name is required")
      .notEmpty()
      .trim()
      .isAlpha()
      .withMessage("last_name can only contain alphabets");
    req
      .check("email", "email is required")
      .notEmpty()
      .isEmail()
      .withMessage("invalid email");
    req
      .check("password", "password is required")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .withMessage("password cannot be less then 6 characters");
    req
      .check("address", "address is required")
      .notEmpty()
      .trim();

    const errors = req.validationErrors();

    if (errors) {
      console.log('auth valid', errors);
      return res.status(400).json({
        errors: extractErrors(errors),
        status: 400
      });
    }
    return next();
  }

  /**
   *
   * Checks if user already exist
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   */

  static async userExists(req, res, next) {
    const { email } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (user) {
        return res.status(409).json({
          status: 409,
          error: `User with email ${email} already exists`
        });
      }
    } catch (err) {
      throw err;
    }
    return next();
  }

  /**
   *
   * Validates user login inputs
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   * @returns
   */
  static validateLogin(req, res, next) {
    req
      .check("email", "email is required")
      .notEmpty()
      .isEmail()
      .trim()
      .withMessage("invalid email");
    req
      .check("password", "password is required")
      .notEmpty()
      .trim();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        errors: extractErrors(errors),
        status: 400
      });
    }
    return next();
  }

  /**
   *
   * Validates authorization token
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   * @returns
   */
  static async isTokenValid(req, res, next) {
    try {
      let authorization;
      if (req.headers.token) authorization = req.headers.token;
      else if (req.body.token) authorization = req.body.token;
      else if (req.headers.authorization) authorization = req.headers.authorization.split(" ")[1];
      if (!authorization) {
        return res
          .status(401)
          .json({ status: 401, error: "You must log in to continue" });
      }
      jwt.verify(authorization, SECRET, async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({
              status: 401,
              error: "Invalid token, kindly log in to continue"
            });
        }
        const { id } = decoded;
        const user = await UserModel.findById(id);
        if (user) {
          req.body.tokenPayload = decoded;
          return next();
        }
        return res
          .status(401)
          .json({
            status: 401,
            error: "User with the specified token does not exist"
          });
      });
    } catch (err) {
      return res
        .status(401)
        .json({ status: 401, error: "Kindly login to continue" });
    }
  }

  /**
   *
   * Verifies admin
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   * @returns
   */

  static isAdmin(req, res, next) {
    try {
      const authorization = req.headers.authorization.split(" ")[1] || req.headers.token || req.body.token;

      if (!authorization) {
        return res
          .status(401)
          .json({
            status: 401,
            message: "Invalid token, kindly log in to continue"
          });
      }
      const verifiedToken = verifyToken(authorization);
      if (!verifiedToken.is_admin) {
        return res
          .status(401)
          .json({
            status: 401,
            message: "Only an Admin can perform this task"
          });
      }
    } catch (err) {
      return res
        .status(401)
        .json({
          status: 500,
          message: "Internal server error, please try again"
        });
    }
    return next();
  }
}

export default AuthValidator;
