import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import { dbUsers } from './db/db.js';

import { validateEmail, validatePassword } from './utils/validators.js';
import { generateTokens, generateAccessToken, verifyRefreshToken } from './utils/jwt.js';

const scryptAsync = promisify(scrypt);

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
};

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

async function comparePassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const passwordBuffer = await scryptAsync(password, salt, 64);
  return timingSafeEqual(hashBuffer, passwordBuffer);
}

function setTokenCookies(res, { accessToken, refreshToken }) {
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
}

export async function register(req, res) {
  const { email, password } = req.body ?? {};

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and contain a digit, a lowercase, an uppercase letter and a special character' });
  }

  const exists = await dbUsers.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const result = await dbUsers.insertOne({ email, password: await hashPassword(password) });

  return res.status(201).json({ userId: result.insertedId, email });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await dbUsers.findOne({ email });
  if (!user?.password || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const tokens = generateTokens({ userId: user._id.toString(), email: user.email });
  setTokenCookies(res, tokens);

  return res.status(200).json(tokens);
}

export function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const { userId, email } = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ userId, email });
    setTokenCookies(res, { accessToken });

    return res.status(200).json({ accessToken });
  } catch {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}

export function logout(req, res) {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  return res.status(200).json({ message: 'Logged out' });
}
