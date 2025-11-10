import Joi from 'joi';

const baseProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .trim()
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name must not exceed 255 characters',
      'string.empty': 'Product name cannot be empty',
      'any.required': 'Product name is required',
    }),

  description: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .messages({
      'string.min': 'Product description must be at least 10 characters long',
      'string.max': 'Product description must not exceed 2000 characters',
      'any.required': 'Product description is required',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .messages({
      'number.base': 'Price must be a valid number',
      'number.positive': 'Price must be a positive number',
      'number.max': 'Price cannot exceed 999,999.99',
      'any.required': 'Price is required',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .messages({
      'number.base': 'Stock must be a valid number',
      'number.integer': 'Stock must be a whole number',
      'number.min': 'Stock cannot be negative',
      'number.max': 'Stock cannot exceed 999,999',
      'any.required': 'Stock is required',
    }),

  category: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 100 characters',
      'any.required': 'Category is required',
    }),
});


export const createProductSchema = baseProductSchema.fork(
  ['name', 'description', 'price', 'stock', 'category'],
  (schema) => schema.required()
);

export const updateProductSchema = baseProductSchema
  .fork(
    ['name', 'description', 'price', 'stock', 'category'],
    (schema) => schema.optional()
  )
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const searchProductSchema = Joi.object({
  search: Joi.string().trim().allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});
