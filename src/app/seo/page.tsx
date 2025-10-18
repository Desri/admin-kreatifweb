import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SEOManagementWrapper } from "@/components/SEO/seo-management-wrapper";
import { SEOManagementSkeleton } from "@/components/SEO/skeleton";

export default function SEOPage() {
  return (
    <>
      <Breadcrumb pageName="SEO Management" />
      <div className="mb-6 rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            Blog Publish Management
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage the publish status of your blog articles for SEO optimization.
          Published articles will appear in your sitemap and be indexed by
          search engines.
        </p>
      </div>
      <Suspense fallback={<SEOManagementSkeleton />}>
        <SEOManagementWrapper />
      </Suspense>
    </>
  );
}
