export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  userId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export interface SearchProductsInput {
  search?: string;
  page?: number;
  limit?: number;
  pageSize?: number;
}
