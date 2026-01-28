"use client";

import { Table, Select, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { PreviewIcon } from "./icons";
import { TrashIcon } from "@/assets/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState, useMemo } from "react";
import { Blog } from "@/types/blog";
import { deleteBlog } from "@/services/blog.service";

export function ListArticleComponent({
  data,
  onDataChange,
}: {
  data: Blog[];
  onDataChange?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "views">("newest");

  const handleDeleteClick = (article: Blog) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const blogId = selectedArticle?._id || selectedArticle?.id;
    if (!blogId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteBlog(blogId);
      setIsDialogOpen(false);
      setSelectedArticle(null);

      // Refresh the data if callback is provided
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((blog) => {
        const categoryName = typeof blog.category === "string"
          ? blog.category
          : blog.category.name;
        return (
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.metaDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((blog) =>
        filterStatus === "published" ? blog.published : !blog.published
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "views") {
        return (b.readCount ?? 0) - (a.readCount ?? 0);
      }
      return 0;
    });

    return sorted;
  }, [data, searchTerm, filterStatus, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.length;
    const published = data.filter(blog => blog.published).length;
    const draft = total - published;
    const totalViews = data.reduce((sum, blog) => sum + (blog.readCount ?? 0), 0);
    return { total, published, draft, totalViews };
  }, [data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const columns: ColumnsType<Blog> = [
    {
      title: 'Article',
      dataIndex: 'title',
      key: 'title',
      width: 400,
      render: (_, blog) => (
        <div className="flex items-start gap-3">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-dark dark:text-white line-clamp-1">
              {blog.title}
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {blog.metaDescription}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (category) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          {typeof category === "string" ? category : category.name}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      width: 100,
      render: (published: boolean) =>
        published ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Draft
          </span>
        ),
    },
    {
      title: 'Views',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 100,
      render: (readCount: number) => (
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="font-medium">{(readCount ?? 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      title: 'Published Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (createdAt: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(createdAt)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, blog) => (
        <div className="flex items-center justify-end gap-x-2">
          <Link href={`/blog/edit/${blog._id}`}>
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-700"
              title="Edit article"
            >
              <PreviewIcon />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteClick(blog)}
            className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20"
            title="Delete article"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-6 py-4 dark:border-dark-3 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Articles
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage and monitor your blog content
            </p>
          </div>
          <Link href="/blog/create">
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Article
            </button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-stroke bg-green-50 p-4 dark:border-dark-3 dark:bg-green-900/20">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Published</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</p>
          </div>
          <div className="rounded-lg border border-stroke bg-yellow-50 p-4 dark:border-dark-3 dark:bg-yellow-900/20">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Drafts</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draft}</p>
          </div>
          <div className="rounded-lg border border-stroke bg-blue-50 p-4 dark:border-dark-3 dark:bg-blue-900/20">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Views</p>
            <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by title, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={
                <svg
                  className="h-7 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              allowClear
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={filterStatus}
              className="py-2"
              onChange={(value) => setFilterStatus(value)}
              style={{ width: 150 }}
              options={[
                { value: "all", label: "All Status" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              className="py-2"
              style={{ width: 150 }}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "views", label: "Most Views" },
              ]}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results count */}
        {searchTerm || filterStatus !== "all" ? (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedData.length} of {data.length} articles
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredAndSortedData}
          rowKey={(record) => record._id || record.id || ''}
          pagination={false}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center gap-3 py-12">
                <svg
                  className="h-12 w-12 text-gray-300 dark:text-gray-600"
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
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">
                    {searchTerm || filterStatus !== "all"
                      ? "No articles match your filters"
                      : "No articles found"}
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                      }}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ),
          }}
        />
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        description={`Are you sure you want to delete "${selectedArticle?.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
      />
    </div>
  );
}
