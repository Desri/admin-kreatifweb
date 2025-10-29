"use client";

import { useEffect, useState } from "react";
import type { Blog } from "@/types/blog";
import { getBlogs } from "@/services/blog.service";
import { ListArticleComponent } from ".";

export function ListArticleWrapper() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const result = await getBlogs();

      // Handle empty or null data
      if (
        !result.data ||
        (Array.isArray(result.data) && result.data.length === 0)
      ) {
        setData([]);
      } else {
        const blogs = Array.isArray(result.data) ? result.data : [result.data];
        setData(blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
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
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-600">
          Unable to load blogs
        </h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => fetchBlogs()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3 sm:px-7 sm:py-5 xl:px-8.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                Articles
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage and monitor your blog content
              </p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
            No articles yet
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Get started by creating your first blog post and share your insights with the world.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/blog/create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Article
            </a>
            <button
              onClick={() => fetchBlogs()}
              className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ListArticleComponent data={data} onDataChange={() => fetchBlogs(false)} />
  );
}
