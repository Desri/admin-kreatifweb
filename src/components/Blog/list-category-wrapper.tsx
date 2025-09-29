"use client";

import { useEffect, useState } from "react";
import { getCategory } from "@/services/category.services";
import { ListCategoryComponent } from "./list-category";
import type { Category } from "@/types/category";

export function ListCategoryWrapper() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const result = await getCategory();
      const categories = Array.isArray(result.data)
        ? result.data
        : [result.data];
      setData(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-600">
          Unable to load categories
        </h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => fetchCategories()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ListCategoryComponent
      data={data}
      onDataChange={() => fetchCategories(false)}
    />
  );
}
