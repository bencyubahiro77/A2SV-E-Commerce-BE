import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 50 characters',
      'any.required': 'Username is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(8)
    .required()
    .custom((value, helpers) => {
      const errors = [];
      
      if (!/[A-Z]/.test(value)) {
        errors.push('at least one uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        errors.push('at least one lowercase letter');
      }
      if (!/\d/.test(value)) {
        errors.push('at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push('at least one special character');
      }
      
      if (errors.length > 0) {
        return helpers.message({
          custom: `Password must contain ${errors.join(', ')}`
        });
      }
      
      return value;
    })
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
      'any.custom': '{{#label}} {{#value}}', 
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});
