
import { AgencyInfo, ClientInfo, Technology } from "@/types/invoice";

export type CurrencyType = 'USD' | 'EUR';

export const initialTechnologies: Technology[] = [
  {
    id: "make",
    name: "Make.com",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "cal",
    name: "Cal.com",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "twilio",
    name: "Twilio",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "synthflow",
    name: "Synthflow",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "vapi",
    name: "Vapi",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "blandai",
    name: "Bland AI",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  },
  {
    id: "ai-service",
    name: "AI Service",
    isSelected: false,
    isVisible: true,
    costPerMinute: 0,
    setupCost: 0
  }
];

export const initialAgencyInfo: AgencyInfo = {
  name: '',
  phone: '',
  address: '',
  email: '',
  website: ''
};

export const initialClientInfo: ClientInfo = {
  name: '',
  address: '',
  tvaNumber: '',
  contactPerson: {
    name: '',
    phone: ''
  }
};
