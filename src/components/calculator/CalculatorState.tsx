import { useState, useEffect } from "react";
import { MakePlan } from "@/types/make";
import { SynthflowPlan } from "@/types/synthflow";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";

export type CurrencyType = 'USD' | 'EUR';

const initialTechnologies = [
  { id: "make", name: "Make.com", isSelected: true, costPerMinute: 0.001 },
  { id: "synthflow", name: "Synthflow", isSelected: true, costPerMinute: 0.002 },
  { id: "calcom", name: "Cal.com", isSelected: true, costPerMinute: 0.003 },
  { id: "twilio", name: "Twilio", isSelected: true, costPerMinute: 0.004 },
  { id: "vapi", name: "Vapi", isSelected: true, costPerMinute: 0.005 },
  { id: "blandai", name: "Bland AI", isSelected: true, costPerMinute: 0.009 },
];

// Helper function to safely parse JSON data with fallback
const safelyParseJSON = <T extends {}>(jsonData: any, defaultValue: T): T => {
  if (!jsonData) return defaultValue;
  
  try {
    if (typeof jsonData === 'object' && jsonData !== null) {
      return { ...defaultValue, ...jsonData };
    }
    
    if (typeof jsonData === 'string') {
      return { ...defaultValue, ...JSON.parse(jsonData) };
    }
  } catch (error) {
    console.error("Error parsing JSON data:", error);
  }
  
  return defaultValue;
};

export function useCalculatorState() {
  const [callDuration, setCallDuration] = useState<number>(5);
  const [totalMinutes, setTotalMinutes] = useState<number>(1000);
  const [margin, setMargin] = useState<number>(20);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [themeColor, setThemeColor] = useState<string>("#2563eb");
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceHistory | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>({
    name: "",
    phone: "",
    address: "",
    email: "",
    website: "",
  });

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    address: "",
    tvaNumber: "",
    contactPerson: {
      name: "",
      phone: ""
    }
  });

  const [selectedMakePlan, setSelectedMakePlan] = useState<MakePlan | null>(null);
  const [selectedSynthflowPlan, setSelectedSynthflowPlan] = useState<SynthflowPlan | null>(null);
  const [selectedCalcomPlan, setSelectedCalcomPlan] = useState<CalcomPlan | null>(null);
  const [selectedTwilioRate, setSelectedTwilioRate] = useState<TwilioSelection | null>(null);
  
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [setupCost, setSetupCost] = useState<number | null>(null);

  // Load saved calculator state from Supabase
  useEffect(() => {
    const loadCalculatorState = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (preferences) {
          setThemeColor(preferences.theme_color || "#2563eb");
        }

        const { data: latestInvoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestInvoice) {
          setCallDuration(latestInvoice.call_duration || 5);
          setTotalMinutes(latestInvoice.total_minutes || 1000);
          setMargin(latestInvoice.margin || 20);
          setTaxRate(latestInvoice.tax_rate || 20);
          
          if (latestInvoice.agency_info) {
            const defaultAgencyInfo: AgencyInfo = {
              name: "",
              phone: "",
              address: "",
              email: "",
              website: "",
            };
            const parsedAgencyInfo = safelyParseJSON<AgencyInfo>(
              latestInvoice.agency_info, 
              defaultAgencyInfo
            );
            setAgencyInfo(parsedAgencyInfo);
          }
          
          if (latestInvoice.client_info) {
            const defaultClientInfo: ClientInfo = {
              name: "",
              address: "",
              tvaNumber: "",
              contactPerson: {
                name: "",
                phone: ""
              }
            };
            const parsedClientInfo = safelyParseJSON<ClientInfo>(
              latestInvoice.client_info, 
              defaultClientInfo
            );
            setClientInfo(parsedClientInfo);
          }
          
          if (latestInvoice.setup_cost) {
            setSetupCost(Number(latestInvoice.setup_cost));
          }
          
          if (latestInvoice.total_amount) {
            setTotalCost(Number(latestInvoice.total_amount));
          }
        }

        const { data: allInvoices } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (allInvoices) {
          const typedInvoices: InvoiceHistory[] = allInvoices.map(invoice => {
            const defaultAgencyInfo: AgencyInfo = {
              name: "",
              phone: "",
              address: "",
              email: "",
              website: "",
            };
            
            const defaultClientInfo: ClientInfo = {
              name: "",
              address: "",
              tvaNumber: "",
              contactPerson: {
                name: "",
                phone: ""
              }
            };
            
            return {
              ...invoice,
              agency_info: safelyParseJSON<AgencyInfo>(invoice.agency_info, defaultAgencyInfo),
              client_info: safelyParseJSON<ClientInfo>(invoice.client_info, defaultClientInfo),
              total_amount: Number(invoice.total_amount),
              setup_cost: Number(invoice.setup_cost),
              monthly_service_cost: Number(invoice.monthly_service_cost),
            } as InvoiceHistory;
          });
          
          setInvoices(typedInvoices);
        }
      } catch (error) {
        console.error('Error loading calculator state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalculatorState();
  }, []);

  useEffect(() => {
    if (editingInvoice) {
      setEditingInvoiceId(editingInvoice.id);
      setCallDuration(editingInvoice.call_duration || 5);
      setTotalMinutes(editingInvoice.total_minutes || 1000);
      setMargin(editingInvoice.margin || 20);
      setTaxRate(editingInvoice.tax_rate || 20);
      setSetupCost(Number(editingInvoice.setup_cost));
      setTotalCost(Number(editingInvoice.total_amount));
      
      if (editingInvoice.agency_info) {
        setAgencyInfo(editingInvoice.agency_info);
      }
      
      if (editingInvoice.client_info) {
        setClientInfo(editingInvoice.client_info);
      }
      
      setShowPreview(true);
    } else {
      setEditingInvoiceId(null);
    }
  }, [editingInvoice]);

  useEffect(() => {
    const saveCalculatorState = async () => {
      if (isLoading) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_preferences')
        .update({ theme_color: themeColor })
        .eq('user_id', user.id);
    };

    saveCalculatorState();
  }, [themeColor, isLoading]);

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
    isEditingInvoice: !!editingInvoice,
  };
}
