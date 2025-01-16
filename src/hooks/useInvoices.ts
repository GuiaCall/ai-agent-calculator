import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceHistory, ClientInfo, AgencyInfo } from '@/types/invoice';

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isValidClientInfo = (info: any): info is ClientInfo => {
    return (
      info &&
      typeof info === 'object' &&
      'name' in info &&
      'address' in info &&
      'tvaNumber' in info &&
      'contactPerson' in info
    );
  };

  const isValidAgencyInfo = (info: any): info is AgencyInfo => {
    return (
      info &&
      typeof info === 'object' &&
      'name' in info &&
      'phone' in info &&
      'address' in info &&
      'email' in info &&
      'website' in info
    );
  };

  const transformInvoiceData = (data: any): InvoiceHistory => {
    console.log('Transforming invoice data:', data);
    
    let clientInfo: ClientInfo;
    let agencyInfo: AgencyInfo;

    try {
      const parsedClientInfo = typeof data.client_info === 'string' 
        ? JSON.parse(data.client_info) 
        : data.client_info;
      
      const parsedAgencyInfo = typeof data.agency_info === 'string'
        ? JSON.parse(data.agency_info)
        : data.agency_info;

      if (!isValidClientInfo(parsedClientInfo)) {
        console.error('Invalid client info structure:', parsedClientInfo);
        throw new Error('Invalid client info structure');
      }

      if (!isValidAgencyInfo(parsedAgencyInfo)) {
        console.error('Invalid agency info structure:', parsedAgencyInfo);
        throw new Error('Invalid agency info structure');
      }

      clientInfo = parsedClientInfo;
      agencyInfo = parsedAgencyInfo;
    } catch (err) {
      console.error('Error parsing invoice data:', err);
      throw new Error('Failed to parse invoice data');
    }

    return {
      id: data.id,
      invoice_number: data.invoice_number,
      created_at: data.created_at,
      client_info: clientInfo,
      agency_info: agencyInfo,
      total_amount: Number(data.total_amount),
      tax_rate: Number(data.tax_rate),
      margin: Number(data.margin),
      setup_cost: Number(data.setup_cost),
      monthly_service_cost: Number(data.monthly_service_cost),
      total_minutes: Number(data.total_minutes),
      call_duration: Number(data.call_duration),
      user_id: data.user_id,
      is_deleted: Boolean(data.is_deleted)
    };
  };

  const fetchInvoices = async () => {
    try {
      console.log('Fetching invoices...');
      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching invoices:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (!data) {
        console.log('No invoices found');
        setInvoices([]);
        return;
      }

      console.log('Raw invoice data:', data);
      const transformedInvoices = data.map(transformInvoiceData);
      console.log('Transformed invoices:', transformedInvoices);
      setInvoices(transformedInvoices);
    } catch (err) {
      console.error('Error in fetchInvoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return { invoices, loading, error };
}