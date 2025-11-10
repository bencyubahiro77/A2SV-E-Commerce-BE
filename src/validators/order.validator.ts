import Joi from 'joi';
import { getOrderStatuses } from '../constants/enums';

export const createOrderSchema = Joi.object({
  description: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Description must not exceed 1000 characters',
  }),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'any.required': 'Product ID is required for each item',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required for each item',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Order must contain at least one item',
      'any.required': 'Order items are required',
    }),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...getOrderStatuses())
    .required()
    .messages({
      'any.only': `Status must be one of: ${getOrderStatuses().join(', ')}`,
      'any.required': 'Status is required',
    }),
});

export const updateOrderSchema = Joi.object({
  description: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Description must not exceed 1000 characters',
  }),

  status: Joi.string()
    .valid(...getOrderStatuses())
    .optional()
    .messages({
      'any.only': `Status must be one of: ${getOrderStatuses().join(', ')}`,
    }),
});
