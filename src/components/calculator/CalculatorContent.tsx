
import { useState } from "react";
import { useCalculatorLogic } from "./CalculatorLogic";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { CalculatorHeader } from "./CalculatorHeader";
import { CalculatorActions } from "./CalculatorActions";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { Disclaimer } from "../Disclaimer";
import { CalculatorSettingsSection } from "./sections/CalculatorSettingsSection";
import { TechnologySection } from "./sections/TechnologySection";
import { PreviewSection } from "./sections/PreviewSection";
import { CurrencyToggle } from "./CurrencyToggle";
import { LoadingState } from "./LoadingState";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { SubscriptionCheck } from "./SubscriptionCheck";

export function CalculatorContent() {
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const {
    invoiceCount,
    isSubscribed,
    isSubscriptionActive,
    isCheckingSubscription
  } = useSubscriptionStatus();

  // Handle calculator actions based on subscription status
  const { handleCalculate } = SubscriptionCheck({
    onProceed: logic.calculateCost,
    isSubscribed,
    isSubscriptionActive,
    isCheckingSubscription,
    invoiceCount,
    editingInvoice: state.editingInvoice
  });

  // Show loading state while checking subscription
  if (state.isLoading || isCheckingSubscription) {
    return <LoadingState />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn mt-20 mb-20">
        <Disclaimer />
        
        <CalculatorHeader
          agencyInfo={state.agencyInfo}
          clientInfo={state.clientInfo}
          onAgencyInfoChange={state.setAgencyInfo}
          onClientInfoChange={state.setClientInfo}
        />

        <CurrencyToggle />
        
        <CalculatorSettingsSection />
        
        <TechnologySection />

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

        <PreviewSection />
      </div>
      <Footer />
    </>
  );
}
