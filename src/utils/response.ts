import { Response } from 'express';
import { BaseResponse, PaginatedResponse } from '../types/response.types';

// Send success response
export const success = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: BaseResponse<T> = {
    success: true,
    message,
    object: data,
    errors: null,
  };

  return res.status(statusCode).json(response);
};

// Send error response
export const error = (
  res: Response,
  message: string,
  errors: string[] = [],
  statusCode: number = 400
): Response => {
  const response: BaseResponse = {
    success: false,
    message,
    errors: errors.length > 0 ? errors : null,
  };

  return res.status(statusCode).json(response);
};

// Send paginated response
export const paginated = <T>(
  res: Response,
  message: string,
  data: T[],
  page: number,
  pageSize: number,
  totalSize: number,
  statusCode: number = 200
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    object: data,
    pageNumber: page,
    pageSize,
    totalSize,
    errors: null,
  };

  return res.status(statusCode).json(response);
};

// Send created response
export const created = <T>(res: Response, message: string, data?: T): Response => {
  return success(res, message, data, 201);
};
