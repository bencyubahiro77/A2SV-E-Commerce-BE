import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name must not exceed 255 characters',
      'any.required': 'Product name is required',
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Product description must be at least 10 characters long',
      'any.required': 'Product description is required',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock is required',
    }),

  category: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 100 characters',
      'any.required': 'Category is required',
    }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name must not exceed 255 characters',
    }),

  description: Joi.string()
    .min(10)
    .messages({
      'string.min': 'Product description must be at least 10 characters long',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .messages({
      'number.positive': 'Price must be a positive number',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
    }),

  category: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 100 characters',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const searchProductSchema = Joi.object({
  search: Joi.string().allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});
