import { prisma } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import { CreateOrderInput } from '../types/order.types';
import { Decimal } from '@prisma/client/runtime/library';

// Create a new order with transaction handling
export const createOrder = async (input: CreateOrderInput) => {
  // Use a transaction to ensure atomicity
  const order = await prisma.$transaction(async (tx) => {
    // Validate all products exist and have sufficient stock
    const productChecks = await Promise.all(
      input.items.map(async (item) => {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        });

        if (!product) {
          throw new NotFoundError(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new ValidationError(
            `Insufficient stock for Product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
        };
      })
    );

    // Calculate total price
    const totalPrice = productChecks.reduce((sum, item) => {
      const itemTotal = new Decimal(item.price).mul(item.quantity);
      return sum.add(itemTotal);
    }, new Decimal(0));

    // Create the order
    const newOrder = await tx.order.create({
      data: {
        userId: input.userId,
        totalPrice: totalPrice,
        status: 'PENDING',
      },
    });

    // Create order items and update product stock
    await Promise.all(
      productChecks.map(async (item) => {
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        // Decrement product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    // Fetch and return the complete order with items
    const completeOrder = await tx.order.findUnique({
      where: { id: newOrder.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return completeOrder;
  });

  logger.info(`Order created: ${order!.id} for user: ${input.userId}`);
  return order;
};

// Get all orders for a specific user
export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  logger.info(`Retrieved ${orders.length} orders for user: ${userId}`);
  return orders;
};
