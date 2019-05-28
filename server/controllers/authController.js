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
}

export default UserController;
