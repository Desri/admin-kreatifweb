import Link from "next/link";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ListCategorySkeleton } from "@/components/Blog/skeleton-category";
import { ListCategoryWrapper } from "@/components/Blog/list-category-wrapper";

export default function CategoryPage() {
  return (
    <>
      <Breadcrumb pageName="Categories" />
      <div className="mb-6 flex items-center justify-between rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div>List Category</div>
        <div>
          <Link
            href={"/blog/add/category"}
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Add Category
          </Link>
        </div>
      </div>
      <Suspense fallback={<ListCategorySkeleton />}>
        <ListCategoryWrapper />
      </Suspense>
    </>
  );
}
