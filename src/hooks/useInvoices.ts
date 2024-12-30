import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory, ClientInfo, AgencyInfo } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

// Type guard to check if a value is a ClientInfo object
function isClientInfo(value: Json): value is ClientInfo {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as any;
  return (
    typeof v.name === 'string' &&
    typeof v.address === 'string' &&
    typeof v.tvaNumber === 'string' &&
    typeof v.contactPerson === 'object' &&
    typeof v.contactPerson.name === 'string' &&
    typeof v.contactPerson.phone === 'string'
  );
}

// Type guard to check if a value is an AgencyInfo object
function isAgencyInfo(value: Json): value is AgencyInfo {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as any;
  return (
    typeof v.name === 'string' &&
    typeof v.phone === 'string' &&
    typeof v.address === 'string' &&
    typeof v.email === 'string' &&
    typeof v.website === 'string'
  );
}

// Transform raw data into proper types
function transformInvoiceData(rawData: any): InvoiceHistory {
  console.log('Transforming invoice data:', rawData);
  
  let clientInfo: ClientInfo;
  let agencyInfo: AgencyInfo;

  try {
    // Parse JSON strings if needed
    const parsedClientInfo = typeof rawData.client_info === 'string' 
      ? JSON.parse(rawData.client_info) 
      : rawData.client_info;
    
    const parsedAgencyInfo = typeof rawData.agency_info === 'string' 
      ? JSON.parse(rawData.agency_info) 
      : rawData.agency_info;

    // Validate and assign client info
    if (!isClientInfo(parsedClientInfo)) {
      console.error('Invalid client info structure:', parsedClientInfo);
      throw new Error('Invalid client info structure');
    }
    clientInfo = parsedClientInfo;

    // Validate and assign agency info
    if (!isAgencyInfo(parsedAgencyInfo)) {
      console.error('Invalid agency info structure:', parsedAgencyInfo);
      throw new Error('Invalid agency info structure');
    }
    agencyInfo = parsedAgencyInfo;

  } catch (error) {
    console.error('Error parsing invoice data:', error);
    // Provide default values if parsing fails
    clientInfo = {
      name: '',
      address: '',
      tvaNumber: '',
      contactPerson: { name: '', phone: '' }
    };
    agencyInfo = {
      name: '',
      phone: '',
      address: '',
      email: '',
      website: ''
    };
  }

  return {
    id: rawData.id,
    invoice_number: rawData.invoice_number,
    created_at: rawData.created_at,
    client_info: clientInfo,
    agency_info: agencyInfo,
    total_amount: Number(rawData.total_amount),
    tax_rate: Number(rawData.tax_rate),
    margin: Number(rawData.margin),
    setup_cost: Number(rawData.setup_cost),
    monthly_service_cost: Number(rawData.monthly_service_cost),
    total_minutes: rawData.total_minutes,
    call_duration: rawData.call_duration,
    user_id: rawData.user_id,
    is_deleted: rawData.is_deleted || false
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('Fetching invoices for user:', user.id);

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }

      console.log('Raw invoice data:', data);

      if (data) {
        const transformedData = data.map(transformInvoiceData);
        console.log('Transformed invoice data:', transformedData);
        setInvoices(transformedData);
      }
    } catch (error: any) {
      console.error('Error in fetchInvoices:', error);
      toast({
        title: "Error fetching invoices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useInvoices hook mounted');
    fetchInvoices();

    const channel = supabase
      .channel('invoice_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Invoice change detected:', payload);
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up invoice subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting invoice:', id);
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      setInvoices(prev => prev.filter(inv => inv.id !== id));
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    invoices,
    isLoading,
    handleDelete,
    refreshInvoices: fetchInvoices
  };
}