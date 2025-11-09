import { Response, NextFunction } from 'express';
import { createProduct as createProductService, getProducts as getProductsService, getProductById as getProductByIdService, updateProduct as updateProductService, deleteProduct as deleteProductService } from '../services/product.service';
import { created, paginated, success } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.types';

// Create a new product
export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await createProductService({
      ...req.body,
      userId: req.user!.userId,
    });
    created(res, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

// Get all products with pagination and search
export const getProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getProductsService(req.query);
    
    paginated(
      res,
      'Products retrieved successfully',
      result.products,
      result.pagination.currentPage,
      result.pagination.pageSize,
      result.pagination.totalProducts
    );
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await getProductByIdService(req.params.id);
    success(res, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    success(res, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProductService(req.params.id);
    success(res, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
