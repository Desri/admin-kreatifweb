import type { ContactResponse } from "@/types/contact";

const API_BASE_URL = "https://api-kreatifweb.vercel.app/api";

export async function getContacts(): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return response.json();
}

export async function deleteContact(id: string): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }

  return response.json();
}
