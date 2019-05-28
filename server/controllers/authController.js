import passwordHash from 'password-hash';
import shortId from 'shortid';
import Auth from '../helpers/auth';
import userModel from '../models/users';

const { generateToken } = Auth;

class UserController {
  /**
     *
     * @param {object} req - request
     * @param {object} res - response
     */
  static async createAccount(req, res) {
    /* istanbul ignore next */
    const isAdmin = false;
    const id = shortId.generate();
    try {
      const { firstName, lastName, email, phone, password, address } = req.body;
      const hashedpassword = passwordHash.generate(password);
      const user = {
        id, firstName, lastName, email, phone, address, isAdmin, password: hashedpassword,
      };
      userModel.push(user);
      const token = await generateToken({ id, isAdmin });
      return res.status(201).json({
        status: 201,
        data: [{
          token, user,
        }],
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal Server error' });
    }
  }

  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = userModel.find(usr => (usr.email === email)
        && (passwordHash.verify(password, usr.password)));
      if (user && user !== undefined) {
        const { id, isAdmin } = user;
        const token = await generateToken({ id, isAdmin });
        return res.status(200).json({ data: [{ token, user }], message: 'Login successful' });
      }
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }
}

export default UserController;
