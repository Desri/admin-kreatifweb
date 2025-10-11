export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  category: string | Category;
  metaDescription: string;
  content: string;
  image?: string;
  readCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogRequest {
  title: string;
  category: string;
  metaDescription: string;
  content: string;
}

export interface BlogResponse {
  success: boolean;
  count?: number;
  data: Blog | Blog[];
  message?: string;
}