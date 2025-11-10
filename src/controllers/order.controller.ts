import { Response, NextFunction } from 'express';
import { createOrder as createOrderService, getUserOrders } from '../services/order.service';
import { created, success } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.types';

// Place a new order
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await createOrderService({
      items: req.body.items,
      userId: req.user!.userId,
    });
    created(res, 'Order placed successfully', order);
  } catch (error) {
    next(error);
  }
};

// Get order history for authenticated user
export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await getUserOrders(req.user!.userId);
    success(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};
