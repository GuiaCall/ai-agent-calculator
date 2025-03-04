
import { useState, useEffect } from "react";
import { MakePlan } from "@/types/make";
import { SynthflowPlan } from "@/types/synthflow";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";

export type CurrencyType = 'USD' | 'EUR' | 'GBP';

const initialTechnologies = [
  { id: "make", name: "Make.com", isSelected: true, costPerMinute: 0.001 },
  { id: "synthflow", name: "Synthflow", isSelected: true, costPerMinute: 0.002 },
  { id: "calcom", name: "Cal.com", isSelected: true, costPerMinute: 0.003 },
  { id: "twilio", name: "Twilio", isSelected: true, costPerMinute: 0.004 },
  { id: "vapi", name: "Vapi", isSelected: true, costPerMinute: 0.005 },
];

// Helper function to safely parse JSON data with fallback
const safelyParseJSON = <T extends {}>(jsonData: any, defaultValue: T): T => {
  if (!jsonData) return defaultValue;
  
  try {
    // If it's already an object, just validate it has the right shape
    if (typeof jsonData === 'object' && jsonData !== null) {
      return { ...defaultValue, ...jsonData };
    }
    
    // If it's a string, parse it
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

        // Get user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (preferences) {
          setThemeColor(preferences.theme_color || "#2563eb");
        }

        // Get latest invoice to restore calculator state
        const { data: latestInvoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestInvoice) {
          // Restore calculator settings
          setCallDuration(latestInvoice.call_duration || 5);
          setTotalMinutes(latestInvoice.total_minutes || 1000);
          setMargin(latestInvoice.margin || 20);
          setTaxRate(latestInvoice.tax_rate || 20);
          
          // Restore agency and client info with proper type checking
          if (latestInvoice.agency_info) {
            // Parse and validate agency_info
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
            // Parse and validate client_info
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
          
          // Restore costs
          if (latestInvoice.setup_cost) {
            setSetupCost(Number(latestInvoice.setup_cost));
          }
          
          if (latestInvoice.total_amount) {
            setTotalCost(Number(latestInvoice.total_amount));
          }
        }

        // Get all invoices
        const { data: allInvoices } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (allInvoices) {
          // Transform all invoices to the correct type
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

  // Save calculator state to Supabase when it changes
  useEffect(() => {
    const saveCalculatorState = async () => {
      if (isLoading) return; // Don't save while loading initial state
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save theme color to user preferences
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
  };
}
