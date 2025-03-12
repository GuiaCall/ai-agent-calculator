
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { safelyParseJSON } from "@/utils/jsonUtils";
import { initialAgencyInfo, initialClientInfo } from "@/components/calculator/calculatorInitialState";

export function useCalculatorData() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [themeColor, setThemeColor] = useState<string>("#2563eb");
  const [savedCallDuration, setSavedCallDuration] = useState<number>(5);
  const [savedTotalMinutes, setSavedTotalMinutes] = useState<number>(1000);
  const [savedMargin, setSavedMargin] = useState<number>(20);
  const [savedTaxRate, setSavedTaxRate] = useState<number>(20);
  const [savedAgencyInfo, setSavedAgencyInfo] = useState<AgencyInfo>(initialAgencyInfo);
  const [savedClientInfo, setSavedClientInfo] = useState<ClientInfo>(initialClientInfo);
  const [savedSetupCost, setSavedSetupCost] = useState<number | null>(null);
  const [savedTotalCost, setSavedTotalCost] = useState<number | null>(null);

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
          setSavedCallDuration(latestInvoice.call_duration || 5);
          setSavedTotalMinutes(latestInvoice.total_minutes || 1000);
          setSavedMargin(latestInvoice.margin || 20);
          setSavedTaxRate(latestInvoice.tax_rate || 20);
          
          if (latestInvoice.agency_info) {
            const parsedAgencyInfo = safelyParseJSON<AgencyInfo>(
              latestInvoice.agency_info, 
              initialAgencyInfo
            );
            setSavedAgencyInfo(parsedAgencyInfo);
          }
          
          if (latestInvoice.client_info) {
            const parsedClientInfo = safelyParseJSON<ClientInfo>(
              latestInvoice.client_info, 
              initialClientInfo
            );
            setSavedClientInfo(parsedClientInfo);
          }
          
          if (latestInvoice.setup_cost) {
            setSavedSetupCost(Number(latestInvoice.setup_cost));
          }
          
          if (latestInvoice.total_amount) {
            setSavedTotalCost(Number(latestInvoice.total_amount));
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
            return {
              ...invoice,
              agency_info: safelyParseJSON<AgencyInfo>(invoice.agency_info, initialAgencyInfo),
              client_info: safelyParseJSON<ClientInfo>(invoice.client_info, initialClientInfo),
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

  return {
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
  };
}
