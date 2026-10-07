import { verifyAccessToken } from '../utils/jwt.js';

export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ')
    ? header.split(' ')[1]
    : req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const { userId, email } = verifyAccessToken(token);
    req.user = { userId, email };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
}
