import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ListContactSkeleton } from "@/components/Contact/skeleton";
import { ListContactWrapper } from "@/components/Contact/list-contact-wrapper";

export default function ContactPage() {
  return (
    <>
      <Breadcrumb pageName="Contact" />
      <div className="mb-6 flex items-center justify-between rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div>List Contact</div>
      </div>
      <Suspense fallback={<ListContactSkeleton />}>
        <ListContactWrapper />
      </Suspense>
    </>
  );
}
