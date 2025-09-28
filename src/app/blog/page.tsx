import Link from "next/link";
import { Suspense } from "react";
import { ListArticleWrapper } from "@/components/Blog/list-article-wrapper";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ListArticleSkeleton } from "@/components/Blog/skeleton";

export default function FormElementsPage() {
  return (
    <>
      <Breadcrumb pageName="Blog" />
      <div className="mb-6 flex items-center justify-between rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div>List Article</div>
        <div>
          <Link
            href={"/blog/add"}
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Add Article
          </Link>
        </div>
      </div>
      <Suspense fallback={<ListArticleSkeleton />}>
        <ListArticleWrapper />
      </Suspense>
    </>
  );
}
