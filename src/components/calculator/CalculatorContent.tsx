
import { useState } from "react";
import { useCalculatorLogic } from "./CalculatorLogic";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { CalculatorHeader } from "./CalculatorHeader";
import { CalculatorActions } from "./CalculatorActions";
import { Navbar } from "../layout/Navbar";
import { Disclaimer } from "../Disclaimer";
import { CalculatorSettingsSection } from "./sections/CalculatorSettingsSection";
import { TechnologySection } from "./sections/TechnologySection";
import { PreviewSection } from "./sections/PreviewSection";
import { CurrencyToggle } from "./CurrencyToggle";
import { LoadingState } from "./LoadingState";
import { SubscriptionCheck } from "./SubscriptionCheck";
import { NavigationSidebar } from "./NavigationSidebar";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function CalculatorContent() {
  const { t } = useTranslation();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ 
    ...state, 
    setShowTechStackWarning: state.setShowTechStackWarning 
  });

  // Handle calculator actions
  const { handleCalculate } = SubscriptionCheck({
    onProceed: () => {
      // Check if any technology is selected
      const selectedTechs = state.technologies.filter(tech => tech.isSelected);
      if (selectedTechs.length === 0) {
        state.setShowTechStackWarning(true);
        toast({
          title: t("warning"),
          description: t("pleaseSelectTechnologyStack"),
          variant: "destructive",
        });
        console.log("No technologies selected - showing warning");
        
        // Scroll to technology section
        const techSection = document.getElementById("technology-section");
        if (techSection) {
          techSection.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      
      logic.calculateCost();
      // Ensure preview is visible after calculation
      state.setShowPreview(true);
    }
  });

  if (state.isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      {/* Navigation Sidebar - using our refactored component */}
      <NavigationSidebar />
      
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn mt-20 mb-20">
        <Disclaimer />
        
        <div id="calculator-header" className="animate-fade-in">
          <CalculatorHeader
            agencyInfo={state.agencyInfo}
            clientInfo={state.clientInfo}
            onAgencyInfoChange={state.setAgencyInfo}
            onClientInfoChange={state.setClientInfo}
          />
        </div>

        <CurrencyToggle />
        
        <div id="calculator-settings" className="animate-fade-in">
          <CalculatorSettingsSection />
        </div>
        
        <div id="technology-section" className="animate-fade-in">
          <TechnologySection />
        </div>

        <CalculatorActions
          onCalculate={handleCalculate}
          onPreviewToggle={() => state.setShowPreview(!state.showPreview)}
          onExportPDF={logic.exportPDF}
          onCancelEdit={logic.cancelEdit}
          totalCost={state.totalCost}
          setupCost={state.setupCost}
          currency={state.currency}
          totalMinutes={state.totalMinutes}
          isEditingInvoice={!!state.editingInvoice}
        />

        <div id="invoice-preview" className="animate-fade-in">
          <PreviewSection />
        </div>
      </div>
    </>
  );
}
