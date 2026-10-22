import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized – no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Admin account no longer exists' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

export default protect;
