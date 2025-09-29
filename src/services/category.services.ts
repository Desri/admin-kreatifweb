import { CategoryResponse, CreateCategoryRequest } from "@/types/category";

const API_BASE_URL = "https://api-kreatifweb.vercel.app/api";

export async function createCategory(
  categoryData: CreateCategoryRequest,
): Promise<CategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: categoryData.name,
      description: categoryData.description,
      isActive: categoryData.isActive
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create blog");
  }

  return response.json();
}

export async function getCategory(): Promise<CategoryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}. ${
          errorData.message || ''
        }`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    throw new Error("Failed to fetch categories: Unknown error occurred");
  }
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  return response.json();
}

export async function updateCategory(
  id: string,
  categoryData: Partial<CreateCategoryRequest>,
): Promise<CategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update category");
  }

  return response.json();
}

export async function deleteCategory(id: string): Promise<CategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return response.json();
}