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

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  createProduct
);

router.get(
  '/',
  validate(searchProductSchema, 'query'),
  getProducts
);

router.get('/:id', getProductById);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteProduct
);

export default router;
