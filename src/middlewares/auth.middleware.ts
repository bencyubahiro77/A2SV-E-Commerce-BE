import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import logger from '../utils/logger';


export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }
    
    const token = authHeader.substring(7); 

    // Verify and decode token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.userId}`);
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to authorize based on user role
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Unauthorized access attempt by user: ${req.user.userId}`);
        throw new AuthorizationError('You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
