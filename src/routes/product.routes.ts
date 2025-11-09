import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  searchProductSchema,
} from '../validators/product.validator';

const router = Router();

/**
 * @route   POST /products
 * @desc    Create a new product (Admin only)
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  createProduct
);

/**
 * @route   GET /products
 * @desc    Get all products with pagination and search
 * @access  Public
 */
router.get(
  '/',
  validate(searchProductSchema, 'query'),
  getProducts
);

/**
 * @route   GET /products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   PUT /products/:id
 * @desc    Update product (Admin only)
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  updateProduct
);

/**
 * @route   DELETE /products/:id
 * @desc    Delete product (Admin only)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteProduct
);

export default router;
