
import { useToast } from "@/hooks/use-toast";
import { CalcomPlan } from "@/types/calcom";
import { useCalculation } from "@/hooks/useCalculation";
import { useExportPDF } from "@/hooks/useExportPDF";
import { useTechnologyHandlers } from "@/hooks/useTechnologyHandlers";

export function useCalculatorLogic({
  technologies,
  setTechnologies,
  selectedMakePlan,
  selectedSynthflowPlan,
  selectedCalcomPlan,
  selectedTwilioRate,
  numberOfUsers,
  totalMinutes,
  margin,
  setTotalCost,
  setSetupCost,
  clientInfo,
  agencyInfo,
  taxRate,
  invoices,
  setInvoices,
  currency,
  setShowPreview,
  callDuration,
  setEditingInvoice,
  isEditingInvoice,
  editingInvoiceId
}: any) {
  const { calculateCost } = useCalculation({
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
    editingInvoiceId
  });

  const { exportPDF } = useExportPDF(invoices || []);
  const { handleCalcomPlanSelect, handleTwilioRateSelect } = useTechnologyHandlers(setTechnologies);

  const cancelEdit = () => {
    setEditingInvoice(null);
  };

  const startEdit = (invoice: any) => {
    setEditingInvoice(invoice);
  };

  // Fonction sécurisée pour l'exportation PDF
  const handleExportPDF = async () => {
    // Assurez-vous que la prévisualisation est visible pour l'exportation
    setShowPreview(true);
    // Donnez du temps au DOM pour se mettre à jour
    await new Promise(resolve => setTimeout(resolve, 300));
    // Exécutez l'exportation
    exportPDF();
  };

  return {
    handleCalcomPlanSelect,
    handleTwilioRateSelect,
    calculateCost,
    startEdit,
    cancelEdit,
    exportPDF: handleExportPDF,
  };
}
