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
import type { Category } from "@/types/category";
import { deleteCategory } from "@/services/category.services";

export function ListCategoryComponent({ data, onDataChange }: { data: Category[]; onDataChange?: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (article: Category) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArticle?._id) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteCategory(selectedArticle._id);
      setIsDialogOpen(false);
      setSelectedArticle(null);

      // Refresh the data if callback is provided
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          List Category
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
            <TableHead>Description</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((category, index) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={category.id || `${category.name || "category"}-${index}`}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <div>{category.name}</div>
              </TableCell>

              <TableCell>{category.description}</TableCell>
              <TableCell>{category.articleCount || 0}</TableCell>
              <TableCell>Active</TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <Link href={`/blog/edit/category/${category._id}`}>
                    <button className="hover:text-primary">
                      <span className="sr-only">View Article</span>
                      <PreviewIcon />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="hover:text-primary"
                  >
                    <span className="sr-only">Delete Article</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedArticle?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
      />
    </div>
  );
}
