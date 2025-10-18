"use client";

import { useState } from "react";
import type { Blog } from "@/types/blog";
import { publishBlog, unpublishBlog } from "@/services/blog.service";

interface SEOManagementProps {
  data: Blog[];
  onDataChange: () => void;
}

export function SEOManagementComponent({
  data,
  onDataChange,
}: SEOManagementProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const handleTogglePublish = async (blog: Blog) => {
    const blogId = blog._id;
    setLoadingStates((prev) => ({ ...prev, [blogId]: true }));

    try {
      if (blog.published) {
        await unpublishBlog(blogId);
      } else {
        await publishBlog(blogId);
      }
      onDataChange();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert(
        `Failed to ${blog.published ? "unpublish" : "publish"} blog. Please try again.`,
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  const publishedBlogs = data.filter((blog) => blog.published);
  const unpublishedBlogs = data.filter((blog) => !blog.published);

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-gray-200 px-7.5 py-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            Blog Articles
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600 dark:text-gray-400">
                Published: {publishedBlogs.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="text-gray-600 dark:text-gray-400">
                Draft: {unpublishedBlogs.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-7.5">
        {data.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No blog articles found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    Title
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    Category
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    Created
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-5">
                      <h5 className="font-medium text-dark dark:text-white">
                        {blog.title}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {blog.metaDescription?.substring(0, 80)}
                        {blog.metaDescription &&
                          blog.metaDescription.length > 80 &&
                          "..."}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {blog.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                          <span className="h-2 w-2 rounded-full bg-green-600"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        disabled={loadingStates[blog._id]}
                        className={`rounded px-4 py-2 text-sm font-medium text-white transition-colors ${
                          blog.published
                            ? "bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300"
                            : "bg-green-500 hover:bg-green-600 disabled:bg-green-300"
                        }`}
                      >
                        {loadingStates[blog._id] ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Loading...
                          </span>
                        ) : blog.published ? (
                          "Unpublish"
                        ) : (
                          "Publish"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
