export interface Contact {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyCategory: string;
  typeOfService: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactResponse {
  success: boolean;
  count?: number;
  data: Contact | Contact[];
  message?: string;
}
