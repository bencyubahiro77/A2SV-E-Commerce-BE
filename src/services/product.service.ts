import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';
import { CreateProductInput, UpdateProductInput, SearchProductsInput } from '../types/product.types';

// Create a new product
export const createProduct = async (input: CreateProductInput) => {
  const product = await prisma.product.create({
    data: {
      name: input.name.toLowerCase(),
      description: input.description,
      price: input.price,
      stock: input.stock,
      category: input.category,
      userId: input.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  logger.info(`Product created: ${product.id} by user: ${input.userId}`);
  return product;
};

// Get all products with pagination and search
export const getProducts = async (input: SearchProductsInput) => {
  const page = input.page || 1;
  const pageSize = input.limit || input.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where = input.search
    ? {
      name: {
        contains: input.search.toLowerCase(),
      },
    }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  logger.info(`Retrieved ${products.length} products (page ${page})`);

  return {
    products,
    pagination: {
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalProducts: totalCount,
    },
  };
};

// Get product by ID
export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
};

// Update product
export const updateProduct = async (id: string, input: UpdateProductInput) => {
  // Check if product exists
  await getProductById(id);

  const product = await prisma.product.update({
    where: { id },
    data: input,
    include: {
      user: {
        select: {
          id: true,
          username: true
        },
      },
    },
  });

  logger.info(`Product updated: ${id}`);
  return product;
};

// Delete product
export const deleteProduct = async (id: string) => {
  // Check if product exists
  await getProductById(id);

  await prisma.product.delete({
    where: { id },
  });

  logger.info(`Product deleted: ${id}`);
};
