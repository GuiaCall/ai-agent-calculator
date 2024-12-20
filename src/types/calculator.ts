import { MakePlan } from "./make";
import { SynthflowPlan } from "./synthflow";
import { CalcomPlan } from "./calcom";
import { TwilioSelection } from "./twilio";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "./invoice";

export type CurrencyType = 'USD' | 'EUR' | 'GBP';

export interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

export interface CalculatorState {
  callDuration: number;
  totalMinutes: number;
  margin: number;
  taxRate: number;
  themeColor: string;
  currency: CurrencyType;
  showPreview: boolean;
  technologies: Technology[];
  invoices: InvoiceHistory[];
  numberOfUsers: number;
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  selectedMakePlan: MakePlan | null;
  selectedSynthflowPlan: SynthflowPlan | null;
  selectedCalcomPlan: CalcomPlan | null;
  selectedTwilioRate: TwilioSelection | null;
  totalCost: number | null;
  setupCost: number | null;
  editingId?: string;
  recalculatedId?: string;
}