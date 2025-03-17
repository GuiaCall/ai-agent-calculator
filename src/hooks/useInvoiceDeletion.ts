
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory } from "@/types/invoice";

export function useInvoiceDeletion(
  invoices: InvoiceHistory[] | null,
  setInvoices: (invoices: InvoiceHistory[]) => void
) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const handleDeleteInvoice = async (id: string) => {
    try {
      // Update the database - set is_deleted to true
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      if (invoices) {
        const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
        setInvoices(updatedInvoices);
      }
      
      // Show toast notification
      toast({
        title: t("invoiceDeleted"),
        description: t("invoiceDeletedDescription"),
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingInvoice"),
        variant: "destructive",
      });
    }
  };

  return { handleDeleteInvoice };
}
