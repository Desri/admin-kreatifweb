"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { PreviewIcon } from "./icons";
import { TrashIcon } from "@/assets/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";

export function ListArticleComponent({ data }: { data: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const handleDeleteClick = (article: any) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting article:", selectedArticle);
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          List Article
        </h2>
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
          {data.map((product) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={product.name + product.profit}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Image
                  src={product.image}
                  className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                  width={60}
                  height={50}
                  alt={"Image for product " + product.name}
                  role="presentation"
                />
                <div>{product.name}</div>
              </TableCell>

              <TableCell>{product.category}</TableCell>

              <TableCell>${product.price}</TableCell>

              <TableCell>{product.sold}</TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">View Article</span>
                    <PreviewIcon />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(product)}
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
        title="Delete Article"
        description={`Are you sure you want to delete "${selectedArticle?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
