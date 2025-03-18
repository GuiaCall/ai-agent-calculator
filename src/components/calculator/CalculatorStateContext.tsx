
import React, { createContext, useContext } from "react";
import { useCalculatorState, CurrencyType } from "./CalculatorState";
import { Technology, InvoiceHistory } from "@/types/invoice";
import { MakePlan } from "@/types/make";
import { SynthflowPlan } from "@/types/synthflow";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";

type CalculatorStateContextType = {
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
  setTechnologies: (value: Technology[]) => void;
  invoices: InvoiceHistory[];
  setInvoices: (value: InvoiceHistory[]) => void;
  numberOfUsers: number;
  setNumberOfUsers: (value: number) => void;
  agencyInfo: any;
  setAgencyInfo: (value: any) => void;
  clientInfo: any;
  setClientInfo: (value: any) => void;
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
  showTechStackWarning: boolean;
  setShowTechStackWarning: (value: boolean) => void;
};

const CalculatorStateContext = createContext<CalculatorStateContextType | undefined>(undefined);

export function CalculatorStateProvider({ children }: { children: React.ReactNode }) {
  const calculatorState = useCalculatorState();
  
  return (
    <CalculatorStateContext.Provider value={calculatorState}>
      {children}
    </CalculatorStateContext.Provider>
  );
}

export function useCalculatorStateContext() {
  const context = useContext(CalculatorStateContext);
  
  if (context === undefined) {
    throw new Error("useCalculatorStateContext must be used within a CalculatorStateProvider");
  }
  
  return context;
}
