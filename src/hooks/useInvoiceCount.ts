
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useInvoiceCount() {
  const [invoiceCount, setInvoiceCount] = useState(0);

  const fetchInvoiceCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_deleted', false);
      
      if (error) {
        console.error("Error fetching invoice count:", error);
        return null;
      }

      setInvoiceCount(count || 0);
      console.log("Invoice count:", count);
      return count || 0;
    } catch (err) {
      console.error("Invoice count fetch error:", err);
      return null;
    }
  };

  return {
    invoiceCount,
    fetchInvoiceCount
  };
}
