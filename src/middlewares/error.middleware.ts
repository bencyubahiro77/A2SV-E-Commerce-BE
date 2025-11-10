import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { error as sendError } from '../utils/response';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

// Global error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      return sendError(res, err.message, err.errors, err.statusCode);
    }
    return sendError(res, err.message, [], err.statusCode);
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendError(res, 'Invalid data provided', [], 400);
  }

  // Handle unexpected errors
  logger.error('Unexpected error:', err);
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    [],
    500
  );
};

// Handle Prisma-specific errors
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError, res: Response) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      return sendError(res, `${field} already exists`, [], 409);

    case 'P2025':
      // Record not found
      return sendError(res, 'Resource not found', [], 404);

    case 'P2003':
      // Foreign key constraint violation
      return sendError(res, 'Related resource not found', [], 400);

    case 'P2014':
      // Invalid ID
      return sendError(res, 'Invalid ID provided', [], 400);

    default:
      logger.error('Unhandled Prisma error:', err);
      return sendError(res, 'Database error occurred', [], 500);
  }
};

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  return sendError(res, `Route ${req.method} ${req.path} not found`, [], 404);
};
