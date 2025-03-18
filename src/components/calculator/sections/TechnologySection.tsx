
import { TechnologyParameters } from "@/components/TechnologyParameters";
import { TechnologyCalculators } from "../TechnologyCalculators";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { Card } from "@/components/ui/card";
import { Technology } from "@/types/invoice";
import { useCalculation } from "@/hooks/useCalculation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TechnologySection() {
  const { 
    technologies, 
    setTechnologies,
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
    editingInvoice
  } = useCalculatorStateContext();
  
  const { t } = useTranslation();
  
  const { showTechStackWarning } = useCalculation({
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

  const handleTechnologyChange = (updatedTechnologies: Technology[]) => {
    setTechnologies(updatedTechnologies);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card 
        className={cn(
          "p-6 bg-background text-foreground transition-all duration-300",
          showTechStackWarning ? "border-2 border-primary-600 shadow-lg ring-2 ring-primary-300 animate-pulse" : ""
        )}
      >
        {showTechStackWarning && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">{t("warning")}</AlertTitle>
            <AlertDescription className="text-red-600">
              {t("pleaseSelectTechnologyStack")}
            </AlertDescription>
          </Alert>
        )}
        
        <TechnologyParameters
          technologies={technologies}
          onTechnologyChange={handleTechnologyChange}
          onVisibilityChange={() => {}}
        />
      </Card>
      <TechnologyCalculators />
    </div>
  );
}
