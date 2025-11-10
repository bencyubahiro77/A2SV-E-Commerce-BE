import jwt from 'jsonwebtoken';
import { AuthenticationError } from './errors';
import { JwtPayload } from '../types/express.types';

const secret: string = process.env.JWT_SECRET || 'sD9!p@3kL0zT7xQr8Bv2FjN1rEw5uY';
const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
    issuer: 'ecommerce-api',
    audience: 'ecommerce-client',
  });
};

// Verify and decode JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'ecommerce-api',
      audience: 'ecommerce-client',
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    } else {
      throw new AuthenticationError('Token verification failed');
    }
  }
};
