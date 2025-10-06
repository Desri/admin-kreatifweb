export interface Category {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  metaDescription: string;
  content: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  profit?: string;
  description?: string;
  articleCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryResponse {
  success: boolean;
  count?: number;
  data: Category | Category[];
  message?: string;
}