import { useEffect } from 'react';
import { useCalculatorStateContext } from './CalculatorStateContext';
import { useInvoiceService } from './InvoiceService';
import { useToast } from '@/hooks/use-toast';

export function useCalculatorEffects() {
  const state = useCalculatorStateContext();
  const { toast } = useToast();
  const invoiceService = useInvoiceService();

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const invoices = await invoiceService.loadInvoices();
        state.setInvoices(invoices);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load invoices",
          variant: "destructive",
        });
      }
    };

    loadSavedData();
  }, []);

  return null;
}