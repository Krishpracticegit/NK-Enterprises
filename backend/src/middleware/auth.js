import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'nk_enterprises_super_secret_jwt_key_2026';
      
      const decoded = jwt.verify(token, secret);

      // Attach decoded user object (excluding password) to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user account not found' });
      }

      return next();
    } catch (error) {
      console.error(`[Auth Middleware Error] Token verification failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no authorization token provided' });
  }
};
