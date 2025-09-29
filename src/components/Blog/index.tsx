"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PreviewIcon } from "./icons";
import { TrashIcon } from "@/assets/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";
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

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          List Article
        </h2>
        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Title
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  No blogs available
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((blog, index) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={blog._id || `blog-${index}`}
              >
                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                  <div>{blog.title}</div>
                </TableCell>

                <TableCell>
                  {typeof blog.category === "string"
                    ? blog.category
                    : blog.category.name}
                </TableCell>

                <TableCell className="max-w-xs truncate">
                  {blog.metaDescription}
                </TableCell>

                <TableCell>Active</TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <Link href={`/blog/edit/${blog._id}`}>
                      <button className="hover:text-primary">
                        <span className="sr-only">View Article</span>
                        <PreviewIcon />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="hover:text-primary"
                    >
                      <span className="sr-only">Delete Article</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
