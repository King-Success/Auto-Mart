import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.SECRET || 'SuperSecretTokenKeyXXX&*&';
/**
 * Handles access token generation and verification
 */
class Auth {
  /**
   * @description Handles access token generation
   * @param {object} payload - The user credential {id, isAdmin}
   * @return {string} access token
   */
  static generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '24h' });
  }

  /**
   * @description Decodes the access token
   * @param {string} token - The access token
   * @returns {object} payload - the decoded access token
   */
  static verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
}

export default Auth;
