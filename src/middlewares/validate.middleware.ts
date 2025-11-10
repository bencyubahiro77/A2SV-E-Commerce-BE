import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';
import { sanitizeObject } from '../utils/sanitizer';

// Middleware to validate request data against Joi schema
export const validate = (
  schema: Joi.ObjectSchema,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Sanitize input before validation
      const dataToValidate = sanitizeObject(req[property]);

      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        throw new ValidationError('Validation failed', errors);
      }

      // Replace request data with validated and sanitized data
      req[property] = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};
