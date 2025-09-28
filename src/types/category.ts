export interface Blog {
  id?: string;
  title: string;
  category: string;
  metaDescription: string;
  content: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryResponse {
  success: boolean;
  count?: number;
  data: Blog | Blog[];
  message?: string;
}