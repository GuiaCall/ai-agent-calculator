export interface ContactPerson {
  name: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  tvaNumber: string;
  contactPerson: ContactPerson;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface AgencyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  website: string;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface InvoiceHistory {
  id: string;
  invoiceNumber: string;
  date: Date;
  clientInfo: ClientInfo;
  agencyInfo: AgencyInfo;
  totalAmount: number;
  taxRate: number;
  margin: number;
}