
import { useState } from "react";
import { MakePlan } from "@/types/make";
import { SynthflowPlan } from "@/types/synthflow";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";
import { useCalculatorData } from "@/hooks/useCalculatorData";
import { useThemePreference } from "@/hooks/useThemePreference";
import { useInvoiceEditing } from "@/hooks/useInvoiceEditing";
import { 
  initialTechnologies,
  initialAgencyInfo,
  initialClientInfo,
  CurrencyType
} from "./calculatorInitialState";

export type { CurrencyType };

export function useCalculatorState() {
  // Load data from Supabase
  const { 
    isLoading, 
    invoices, 
    setInvoices,
    themeColor,
    setThemeColor,
    savedCallDuration,
    savedTotalMinutes,
    savedMargin,
    savedTaxRate,
    savedAgencyInfo,
    savedClientInfo,
    savedSetupCost,
    savedTotalCost
  } = useCalculatorData();

  // State for calculator settings
  const [callDuration, setCallDuration] = useState<number>(savedCallDuration);
  const [totalMinutes, setTotalMinutes] = useState<number>(savedTotalMinutes);
  const [margin, setMargin] = useState<number>(savedMargin);
  const [taxRate, setTaxRate] = useState<number>(savedTaxRate);
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(1);
  const [showTechStackWarning, setShowTechStackWarning] = useState<boolean>(false);
  
  // Client and agency info
  const [agencyInfo, setAgencyInfo] = useState(savedAgencyInfo);
  const [clientInfo, setClientInfo] = useState(savedClientInfo);

  // Selected plans and rates
  const [selectedMakePlan, setSelectedMakePlan] = useState<MakePlan | null>(null);
  const [selectedSynthflowPlan, setSelectedSynthflowPlan] = useState<SynthflowPlan | null>(null);
  const [selectedCalcomPlan, setSelectedCalcomPlan] = useState<CalcomPlan | null>(null);
  const [selectedTwilioRate, setSelectedTwilioRate] = useState<TwilioSelection | null>(null);
  
  // Cost calculations
  const [totalCost, setTotalCost] = useState<number | null>(savedTotalCost);
  const [setupCost, setSetupCost] = useState<number | null>(savedSetupCost);

  // Invoice editing
  const {
    editingInvoice,
    setEditingInvoice,
    editingInvoiceId,
    isEditingInvoice
  } = useInvoiceEditing(
    setCallDuration,
    setTotalMinutes,
    setMargin,
    setTaxRate,
    setSetupCost,
    setTotalCost,
    setAgencyInfo,
    setClientInfo,
    setShowPreview
  );

  // Save theme preferences
  useThemePreference(themeColor, isLoading);

  return {
    callDuration,
    setCallDuration,
    totalMinutes,
    setTotalMinutes,
    margin,
    setMargin,
    taxRate,
    setTaxRate,
    themeColor,
    setThemeColor,
    currency,
    setCurrency,
    showPreview,
    setShowPreview,
    technologies,
    setTechnologies,
    invoices,
    setInvoices,
    numberOfUsers,
    setNumberOfUsers,
    agencyInfo,
    setAgencyInfo,
    clientInfo,
    setClientInfo,
    selectedMakePlan,
    setSelectedMakePlan,
    selectedSynthflowPlan,
    setSelectedSynthflowPlan,
    selectedCalcomPlan,
    setSelectedCalcomPlan,
    selectedTwilioRate,
    setSelectedTwilioRate,
    totalCost,
    setTotalCost,
    setupCost,
    setSetupCost,
    isLoading,
    editingInvoice,
    setEditingInvoice,
    editingInvoiceId,
    isEditingInvoice,
    showTechStackWarning,
    setShowTechStackWarning,
  };
}
