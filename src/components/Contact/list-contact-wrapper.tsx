"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/types/contact";
import { getContacts } from "@/services/contact.service";
import { ListArticleComponent } from ".";

export function ListContactWrapper() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const result = await getContacts();

      // Handle empty or null data
      if (
        !result.data ||
        (Array.isArray(result.data) && result.data.length === 0)
      ) {
        setData([]);
      } else {
        const contacts = Array.isArray(result.data) ? result.data : [result.data];
        setData(contacts);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-600">
          Unable to load contacts
        </h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => fetchContacts()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            List Contact
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-8 w-8 text-gray-400 dark:text-gray-500"
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
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            No contact found
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            No contact submissions have been received yet.
          </p>
          <button
            onClick={() => fetchContacts()}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <ListArticleComponent data={data} onDataChange={() => fetchContacts(false)} />
  );
}
