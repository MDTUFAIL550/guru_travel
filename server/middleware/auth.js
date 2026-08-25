import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'guru_travel_jwt_secret_key_2026_vaishali';
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gurutravel@2026';

/**
 * Middleware to require and verify Admin JWT authentication.
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required. Please login as admin.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired admin session. Please login again.'
    });
  }
}
