"use client";

import { useEffect, useState } from "react";
import { getCategory } from "@/services/category.services";
import { ListCategoryComponent } from "./list-category";

export function ListCategoryWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCategory();
      console.log("Check", result.data);
      setData(result.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Unable to load categories
        </h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return <ListCategoryComponent data={data} />;
}
