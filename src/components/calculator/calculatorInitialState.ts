
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { MakePlan } from "@/types/make";
import { SynthflowPlan } from "@/types/synthflow";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";

export type CurrencyType = 'USD' | 'EUR';

export interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

export const initialTechnologies: Technology[] = [
  { id: "make", name: "Make.com", isSelected: true, costPerMinute: 0.001 },
  { id: "synthflow", name: "Synthflow", isSelected: true, costPerMinute: 0.002 },
  { id: "calcom", name: "Cal.com", isSelected: true, costPerMinute: 0.003 },
  { id: "twilio", name: "Twilio", isSelected: true, costPerMinute: 0.004 },
  { id: "vapi", name: "Vapi", isSelected: true, costPerMinute: 0.005 },
  { id: "blandai", name: "Bland AI", isSelected: true, costPerMinute: 0.009 },
];

export const initialAgencyInfo: AgencyInfo = {
  name: "",
  phone: "",
  address: "",
  email: "",
  website: "",
};

export const initialClientInfo: ClientInfo = {
  name: "",
  address: "",
  tvaNumber: "",
  contactPerson: {
    name: "",
    phone: ""
  }
};

export interface CalculatorState {
  callDuration: number;
  setCallDuration: (value: number) => void;
  totalMinutes: number;
  setTotalMinutes: (value: number) => void;
  margin: number;
  setMargin: (value: number) => void;
  taxRate: number;
  setTaxRate: (value: number) => void;
  themeColor: string;
  setThemeColor: (value: string) => void;
  currency: CurrencyType;
  setCurrency: (value: CurrencyType) => void;
  showPreview: boolean;
  setShowPreview: (value: boolean) => void;
  technologies: Technology[];
  setTechnologies: (value: Technology[] | ((prev: Technology[]) => Technology[])) => void;
  invoices: InvoiceHistory[];
  setInvoices: (value: InvoiceHistory[]) => void;
  numberOfUsers: number;
  setNumberOfUsers: (value: number) => void;
  agencyInfo: AgencyInfo;
  setAgencyInfo: (value: AgencyInfo) => void;
  clientInfo: ClientInfo;
  setClientInfo: (value: ClientInfo) => void;
  selectedMakePlan: MakePlan | null;
  setSelectedMakePlan: (value: MakePlan | null) => void;
  selectedSynthflowPlan: SynthflowPlan | null;
  setSelectedSynthflowPlan: (value: SynthflowPlan | null) => void;
  selectedCalcomPlan: CalcomPlan | null;
  setSelectedCalcomPlan: (value: CalcomPlan | null) => void;
  selectedTwilioRate: TwilioSelection | null;
  setSelectedTwilioRate: (value: TwilioSelection | null) => void;
  totalCost: number | null;
  setTotalCost: (value: number | null) => void;
  setupCost: number | null;
  setSetupCost: (value: number | null) => void;
  isLoading: boolean;
  editingInvoice: InvoiceHistory | null;
  setEditingInvoice: (value: InvoiceHistory | null) => void;
  editingInvoiceId: string | null;
  isEditingInvoice: boolean;
}
