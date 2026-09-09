import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'nk_enterprises_super_secret_jwt_key_2026';
  return jwt.sign(
    { id: userId, role },
    secret,
    { expiresIn: '30d' }
  );
};

export default generateToken;
