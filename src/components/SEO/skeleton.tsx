export function SEOManagementSkeleton() {
  return (
    <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 animate-pulse">
        <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-200 py-4 dark:border-gray-700"
            >
              <div className="flex-1">
                <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
