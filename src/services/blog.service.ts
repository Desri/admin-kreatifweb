import type { Blog, CreateBlogRequest, BlogResponse } from "@/types/blog";

const API_BASE_URL = "https://api-kreatifweb.vercel.app/api";

export async function createBlog(
  blogData: CreateBlogRequest,
  imageFile?: File,
): Promise<BlogResponse> {
  const formData = new FormData();

  formData.append('title', blogData.title);
  formData.append('category', blogData.category);
  formData.append('metaDescription', blogData.metaDescription);
  formData.append('content', blogData.content);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create blog");
  }

  return response.json();
}

export async function getBlogs(): Promise<BlogResponse> {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return response.json();
}

export async function getBlogById(id: string): Promise<BlogResponse> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }

  return response.json();
}

export async function updateBlog(
  id: string,
  blogData: Partial<CreateBlogRequest>,
  imageFile?: File,
): Promise<BlogResponse> {
  const formData = new FormData();

  if (blogData.title) formData.append('title', blogData.title);
  if (blogData.category) formData.append('category', blogData.category);
  if (blogData.metaDescription) formData.append('metaDescription', blogData.metaDescription);
  if (blogData.content) formData.append('content', blogData.content);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update blog");
  }

  return response.json();
}

export async function deleteBlog(id: string): Promise<BlogResponse> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete blog");
  }

  return response.json();
}