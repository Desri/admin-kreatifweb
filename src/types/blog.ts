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