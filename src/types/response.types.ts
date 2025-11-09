export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  object?: T;
  errors?: string[] | null;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  object: T[];
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  errors?: string[] | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  pageSize?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}
