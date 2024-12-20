export interface ContactPerson {
  name: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  tvaNumber: string;
  contactPerson: ContactPerson;
}

export interface AgencyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  website: string;
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