import passwordHash from "password-hash";
import Auth from "../helpers/auth";
import helper from "../helpers";
import Mailer from "../helpers/mail";
import userModel from "../models/users";

const { generateToken, verifyToken } = Auth;
const { sendMail } = Mailer;

class UserController {
  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async createAccount(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        password,
        address
      } = req.body;
      const hashedpassword = passwordHash.generate(password);
      const values = [
        first_name,
        last_name,
        email,
        hashedpassword,
        phone,
        address
      ];
      const user = await userModel.create(values);
      if (user) {
        const { id, is_admin } = user;
        const token = await generateToken({ id, is_admin });
        return res.status(201).json({
          status: 201,
          data: { token, ...user }
        });
      }
    } catch (err) {
      console.log('singup cont', err)
      if (err.constraint === "users_email_key") {
        return res.status(409).json({
          error: true,
          message: "User with this email already exists"
        });
      }
      if (err.constraint === "users_phone_key") {
        return res.status(409).json({
          error: true,
          message: "User with this phone number already exit"
        });
      }
      return res
        .status(500)
        .json({ error: true, message: "Internal Server error" });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (user) {
        if (passwordHash.verify(password, user.password)) {
          const { id, is_admin } = user;
          const token = await generateToken({ id, is_admin });
          return res.status(200).json({
            status: 200,
            data: { token, ...user }
          });
        }
        console.log('login cont user', user)
        return res
          .status(401)
          .json({ error: true, message: "Invalid email or password" });
      }
      console.log('login cont user', user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    } catch (err) {
      console.log('login cont', err)
      return res
        .status(500)
        .json({ error: true, message: "Internal Server error" });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async getAccount(req, res) {
    try {
      const { userId } = req.params;
      const user = await userModel.findById(userId);
      if (user) {
        return res.status(200).json({ data: [user] });
      }
      return res.status(404).json({ status: 404, message: "user not found" });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server error" });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */

  static async validateToken(req, res) {
    const { token } = req.body;
    try {
      const payload = await verifyToken(token);
      if (!payload) {
        return res.status(401).json({ status: 401, error: "Invalid token" });
      }
      return res.status(200).json({ status: 200, data: payload });
    } catch (err) {
      return res.status(401).json({ status: 401, error: "Invalid token" });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async passwordResetEmail(req, res) {
    let info;
    try {
      const { email } = req.params;
      const user = userModel.findByEmail(email);
      if (!user) {
        return res
          .status(404)
          .json({ status: 404, message: "Invalid email, user not found" });
      }
      const { id } = user;
      const token = await generateToken({ email, id });
      const url = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/reset/${token}`;
      const message = helper.resetEmail(url);
      const subject = "Password Reset Link";
      info = await sendMail({ to: email, subject, html: message });
      const { accepted } = info;
      if (accepted[0] === email) {
        return res.status(200).json({
          status: 200,
          message: "Check your mail for password reset link",
          email
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error", info });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async resetPasswordForm(req, res) {
    const { token } = req.params;
    try {
      const { email, id } = verifyToken(token);
      if (!email) {
        const user = await userModel.findById(id);
        if (!user) {
          return res.send(helper.errorTemplate("Invalid token"));
        }
        return res.send(helper.resetTemplate(user.email));
      }
      return res.send(helper.resetTemplate(email));
    } catch (err) {
      res.send(helper.errorTemplate("Invalid token"));
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async resetPassword(req, res) {
    const { email, password, passwordConfirmation } = req.body;
    if (!password || password.length < 6) {
      res.send(
        helper.resetTemplate(
          email,
          '<div class="alert">Password is must be at least 6 characters long</div>'
        )
      );
    } else if (password !== passwordConfirmation) {
      res.send(
        helper.resetTemplate(
          email,
          '<div class="alert">Password does not match!</div>'
        )
      );
    } else {
      const hashedpassword = await passwordHash.generate(password);
      const data = { name: "password", value: hashedpassword };
      const user = userModel.updateByEmail(email, data);
      if (user) {
        const url = "https://king-success.github.io/Auto-Mart/UI/login.html";
        res.send(
          helper.successTemplate(
            "Password reset successfully",
            `<a href="${url}">Login</a>`
          )
        );
      } else {
        res.send(
          helper.resetTemplate(
            email,
            '<div class="alert">Unable to reset password, try again</div>'
          )
        );
      }
    }
  }
}

export default UserController;
