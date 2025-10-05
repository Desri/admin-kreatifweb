"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "@/assets/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { Contact } from "@/types/contact";
import { deleteContact } from "@/services/contact.service";

export function ListArticleComponent({
  data,
  onDataChange,
}: {
  data: Contact[];
  onDataChange?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const contactId = selectedContact?._id || selectedContact?.id;
    if (!contactId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteContact(contactId);
      setIsDialogOpen(false);
      setSelectedContact(null);

      // Refresh the data if callback is provided
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          List Contact
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
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Company Category</TableHead>
            <TableHead>Type of Service</TableHead>
            <TableHead>Message</TableHead>
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
                  No contact available
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((contact, index) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={contact._id || `contact-${index}`}
              >
                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                  <div>{contact.name}</div>
                </TableCell>

                <TableCell>{contact.email}</TableCell>

                <TableCell>{contact.phone}</TableCell>

                <TableCell>{contact.companyName}</TableCell>

                <TableCell>{contact.companyCategory}</TableCell>

                <TableCell>{contact.typeOfService}</TableCell>

                <TableCell className="max-w-xs truncate">
                  {contact.message}
                </TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button
                      onClick={() => handleDeleteClick(contact)}
                      className="hover:text-primary"
                    >
                      <span className="sr-only">Delete Contact</span>
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
        title="Delete Contact"
        description={`Are you sure you want to delete contact from "${selectedContact?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
      />
    </div>
  );
}
