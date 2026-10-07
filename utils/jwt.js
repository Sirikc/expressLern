import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'accesskey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshkey';

export const ACCESS_EXPIRES_IN = '15m';
export const REFRESH_EXPIRES_IN = '7d';

export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function generateTokens(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
