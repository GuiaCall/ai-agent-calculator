
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, FileDown, Eye, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CalculatorActionsProps {
  onCalculate: () => void;
  onPreviewToggle: () => void;
  onExportPDF: () => void;
  onCancelEdit?: () => void;
  totalCost: number | null;
  setupCost: number | null;
  currency: string;
  totalMinutes: number;
  isEditingInvoice?: boolean;
}

export function CalculatorActions({
  onCalculate,
  onPreviewToggle,
  onExportPDF,
  onCancelEdit,
  totalCost,
  setupCost,
  currency,
  totalMinutes,
  isEditingInvoice = false,
}: CalculatorActionsProps) {
  const currencySymbol = currency === 'EUR' ? '€' : '$';
  const { t } = useTranslation();

  // Fonction d'exportation avec vérification supplémentaire
  const handleExportPDF = () => {
    // Si aucun calcul n'a été effectué, d'abord montrer la prévisualisation
    if (totalCost === null || setupCost === null) {
      onCalculate();
      setTimeout(() => {
        onExportPDF();
      }, 500);
    } else {
      onExportPDF();
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <Button 
          onClick={onCalculate} 
          variant="default"
          className={cn(
            "w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg",
            isEditingInvoice && "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          )}
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isEditingInvoice ? t("recalculateCost") : t("calculate")}
        </Button>
        
        <Button 
          onClick={onPreviewToggle} 
          variant="outline"
          className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent font-medium px-6 py-2 rounded-lg shadow-sm transform transition-all hover:-translate-y-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("togglePreview")}
        </Button>
        
        <Button 
          onClick={handleExportPDF} 
          variant="outline"
          className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent font-medium px-6 py-2 rounded-lg shadow-sm transform transition-all hover:-translate-y-1"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {t("exportPDF")}
        </Button>
        
        {isEditingInvoice && onCancelEdit && (
          <Button 
            onClick={onCancelEdit} 
            variant="outline"
            className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white hover:border-transparent font-medium px-6 py-2 rounded-lg shadow-sm transform transition-all hover:-translate-y-1"
          >
            <X className="mr-2 h-4 w-4" />
            {t("cancelEdit")}
          </Button>
        )}
      </div>

      {totalCost !== null && setupCost !== null && (
        <div className="space-y-4">
          <div className={cn(
            "p-6 rounded-lg space-y-3",
            "bg-gradient-to-br from-white to-indigo-50",
            "shadow-md border border-indigo-100"
          )}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">{t("monthlyCost")}</p>
                <p className="text-2xl font-bold text-indigo-800">{currencySymbol} {totalCost.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">{t("setupCost")}</p>
                <p className="text-2xl font-bold text-indigo-800">{currencySymbol} {setupCost.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">{t("totalMinutes")}</p>
                <p className="text-2xl font-bold text-indigo-800">{totalMinutes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
