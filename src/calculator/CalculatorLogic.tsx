
import { useCalculation } from "@/hooks/useCalculation";
import { useExportPDF } from "@/hooks/useExportPDF";
import { useNavigate } from "react-router-dom";

export function useCalculatorLogic({
  technologies,
  totalMinutes,
  margin,
  agencyInfo,
  clientInfo,
  taxRate,
  setTotalCost,
  setSetupCost,
  setShowPreview,
  callDuration,
  invoices,
  setInvoices,
  setEditingInvoice,
  editingInvoice,
  resetCalculator,
}) {
  const navigate = useNavigate();
  
  const { calculateCost, showTechStackWarning } = useCalculation({
    technologies,
    totalMinutes,
    margin,
    agencyInfo,
    clientInfo,
    taxRate,
    setTotalCost,
    setSetupCost,
    setShowPreview,
    callDuration,
    invoices,
    setInvoices,
    editingInvoiceId: editingInvoice?.id || null
  });

  const { exportPDF } = useExportPDF(invoices || []);

  const cancelEdit = () => {
    setEditingInvoice(null);
    resetCalculator();
    navigate('/dashboard');
  };

  return {
    calculateCost,
    exportPDF,
    cancelEdit,
    showTechStackWarning,
  };
}
