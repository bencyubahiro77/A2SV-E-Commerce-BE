import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema } from '../validators/order.validator';

const router = Router();

// Place a new order
router.post('/', authenticate, authorize('USER'), validate(createOrderSchema), createOrder);

// Get order history
router.get('/', authenticate, getMyOrders);

export default router;
