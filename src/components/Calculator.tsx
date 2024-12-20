import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TechnologyParameters } from "./TechnologyParameters";
import { InvoiceHistoryList } from "./InvoiceHistory";
import { CalculatorHeader } from "./calculator/CalculatorHeader";
import { CalculatorActions } from "./calculator/CalculatorActions";
import { CalculatorPreview } from "./calculator/CalculatorPreview";
import { useCalculatorLogic } from "./calculator/CalculatorLogic";
import { CalculatorSettings } from "./CalculatorSettings";
import { TechnologyCalculators } from "./calculator/TechnologyCalculators";
import { CalculatorStateProvider, useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { Disclaimer } from "./Disclaimer";
import { format } from 'date-fns';
import { checkInvoiceLimit, saveInvoice, loadInvoices, deleteInvoice } from './calculator/InvoiceService';
import { useCalculatorEffects } from "./calculator/CalculatorEffects";

function CalculatorContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state, currency: state.currency });
  
  useCalculatorEffects();

  const handleSettingChange = (setting: string, value: number) => {
    switch (setting) {
      case 'callDuration':
        state.setCallDuration(value);
        break;
      case 'totalMinutes':
        state.setTotalMinutes(value);
        break;
      case 'margin':
        state.setMargin(value);
        break;
      case 'taxRate':
        state.setTaxRate(value);
        break;
    }
  };

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

        <CalculatorSettings
          callDuration={state.callDuration}
          totalMinutes={state.totalMinutes}
          margin={state.margin}
          taxRate={state.taxRate}
          onSettingChange={handleSettingChange}
        />

        <TechnologyParameters
          technologies={state.technologies}
          onTechnologyChange={state.setTechnologies}
          onVisibilityChange={() => {}}
        />

        <TechnologyCalculators />

        <CalculatorActions
          onCalculate={logic.calculateCost}
          onPreviewToggle={() => state.setShowPreview(!state.showPreview)}
          onExportPDF={() => logic.exportPDF()}
          totalCost={state.totalCost || 0}
          setupCost={state.setupCost || 0}
          currency={state.currency}
          totalMinutes={state.totalMinutes}
        />

        {state.showPreview && (
          <CalculatorPreview
            showPreview={state.showPreview}
            agencyInfo={state.agencyInfo}
            clientInfo={state.clientInfo}
            totalMinutes={state.totalMinutes}
            totalCost={state.totalCost || 0}
            setupCost={state.setupCost || 0}
            taxRate={state.taxRate}
            currency={state.currency}
          />
        )}

        <InvoiceHistoryList
          invoices={state.invoices}
          onEdit={(invoice) => logic.handleEdit(invoice, state.setEditingId, state.setRecalculatedId)}
          onDelete={async (id) => {
            await deleteInvoice(id);
            state.setInvoices(state.invoices.filter((inv) => inv.id !== id));
          }}
          onPrint={logic.exportPDF}
          onSave={(invoice) => logic.handleSave(invoice, state.setEditingId, state.setRecalculatedId)}
          editingId={state.editingId}
          recalculatedId={state.recalculatedId}
          currency={state.currency}
        />
      </div>
      <Footer />
    </>
  );
}

export function Calculator() {
  return (
    <CalculatorStateProvider>
      <CalculatorContent />
    </CalculatorStateProvider>
  );
}