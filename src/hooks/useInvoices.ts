import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceHistory, ClientInfo, AgencyInfo } from '@/types/invoice';

// Type guard for ClientInfo
function isClientInfo(obj: any): obj is ClientInfo {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.address === 'string' &&
    typeof obj.tvaNumber === 'string' &&
    obj.contactPerson &&
    typeof obj.contactPerson.name === 'string' &&
    typeof obj.contactPerson.phone === 'string'
  );
}

// Type guard for AgencyInfo
function isAgencyInfo(obj: any): obj is AgencyInfo {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.address === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.website === 'string'
  );
}

// Transform raw data into proper types
function transformInvoiceData(rawData: any): InvoiceHistory {
  console.log('Processing invoice:', rawData.invoice_number);
  
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
      clientInfo = {
        name: parsedClientInfo?.name || '',
        address: parsedClientInfo?.address || '',
        tvaNumber: parsedClientInfo?.tvaNumber || '',
        contactPerson: {
          name: parsedClientInfo?.contactPerson?.name || '',
          phone: parsedClientInfo?.contactPerson?.phone || ''
        }
      };
    } else {
      clientInfo = parsedClientInfo;
    }

    // Validate and assign agency info
    if (!isAgencyInfo(parsedAgencyInfo)) {
      console.error('Invalid agency info structure:', parsedAgencyInfo);
      agencyInfo = {
        name: parsedAgencyInfo?.name || '',
        phone: parsedAgencyInfo?.phone || '',
        address: parsedAgencyInfo?.address || '',
        email: parsedAgencyInfo?.email || '',
        website: parsedAgencyInfo?.website || ''
      };
    } else {
      agencyInfo = parsedAgencyInfo;
    }

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
    date: new Date(rawData.created_at),
    invoice_number: rawData.invoice_number,
    client_info: clientInfo,
    agency_info: agencyInfo,
    total_amount: rawData.total_amount,
    tax_rate: rawData.tax_rate,
    margin: rawData.margin,
    setup_cost: rawData.setup_cost,
    monthly_service_cost: rawData.monthly_service_cost,
    total_minutes: rawData.total_minutes,
    call_duration: rawData.call_duration,
    user_id: rawData.user_id,
    is_deleted: rawData.is_deleted || false
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching invoices...');
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invoices:', error);
          setError(error.message);
          return;
        }

        console.log('Raw invoice data:', data);
        
        if (!data) {
          console.log('No invoices found');
          setInvoices([]);
          return;
        }

        const transformedInvoices = data.map(invoice => transformInvoiceData(invoice));
        console.log('Transformed invoices:', transformedInvoices);
        setInvoices(transformedInvoices);
      } catch (err) {
        console.error('Unexpected error in useInvoices:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();

    // Subscribe to changes
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
          console.log('Received invoice change:', payload);
          fetchInvoices(); // Refresh the invoices when there's a change
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { invoices, loading, error };
}