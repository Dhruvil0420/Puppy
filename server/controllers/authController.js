import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/* ── POST /api/auth/login ──────────────────────────────────────── */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin || !(await admin.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(admin._id);

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, email: admin.email, name: admin.name },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/auth/me ──────────────────────────────────────────── */
export const getMe = (req, res) => {
  res.json({
    success: true,
    data: { id: req.admin._id, email: req.admin.email, name: req.admin.name },
  });
};

/* ── POST /api/auth/logout ─────────────────────────────────────── */
export const logout = (_req, res) => {
  // Stateless JWT – nothing to invalidate server-side
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};
