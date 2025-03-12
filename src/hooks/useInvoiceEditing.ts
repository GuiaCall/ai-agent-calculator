
import { useState, useEffect } from "react";
import { InvoiceHistory } from "@/types/invoice";

export function useInvoiceEditing(
  setCallDuration: (value: number) => void,
  setTotalMinutes: (value: number) => void,
  setMargin: (value: number) => void,
  setTaxRate: (value: number) => void,
  setSetupCost: (value: number | null) => void,
  setTotalCost: (value: number | null) => void,
  setAgencyInfo: (value: any) => void,
  setClientInfo: (value: any) => void,
  setShowPreview: (value: boolean) => void
) {
  const [editingInvoice, setEditingInvoice] = useState<InvoiceHistory | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

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

  return {
    editingInvoice,
    setEditingInvoice,
    editingInvoiceId,
    isEditingInvoice: !!editingInvoice
  };
}
