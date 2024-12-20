import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

function CalculatorContent() {
  const { toast } = useToast();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state, currency: state.currency });

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

  const exportPDF = async (invoice?: any) => {
    if (!state.totalCost && !invoice) {
      toast({
        title: "Error",
        description: "Please calculate the cost first",
        variant: "destructive",
      });
      return;
    }

    const pdf = new jsPDF();
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      imgWidth,
      Math.min(imgHeight, pageHeight)
    );

    if (!invoice) {
      const invoiceNumber = `INV-${format(new Date(), 'yyyyMMdd')}-${state.invoices.length + 1}`;
      const newInvoice = {
        id: crypto.randomUUID(),
        invoiceNumber,
        date: new Date(),
        clientInfo: state.clientInfo,
        agencyInfo: state.agencyInfo,
        totalAmount: state.totalCost,
        taxRate: state.taxRate,
        margin: state.margin
      };

      const updatedInvoices = [...state.invoices, newInvoice];
      state.setInvoices(updatedInvoices);
      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } else {
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    }
  };

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoiceHistory');
    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices);
      const processedInvoices = parsedInvoices.map((inv: any) => ({
        ...inv,
        date: new Date(inv.date)
      }));
      state.setInvoices(processedInvoices);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoiceHistory', JSON.stringify(state.invoices));
  }, [state.invoices]);

  const convertCurrency = (amount: number) => {
    return state.currency === 'EUR' ? amount * 0.85 : amount;
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
          onExportPDF={() => exportPDF()}
          totalCost={convertCurrency(state.totalCost || 0)}
          setupCost={convertCurrency(state.setupCost || 0)}
          currency={state.currency}
          totalMinutes={state.totalMinutes}
        />

        {state.showPreview && (
          <CalculatorPreview
            showPreview={state.showPreview}
            agencyInfo={state.agencyInfo}
            clientInfo={state.clientInfo}
            totalMinutes={state.totalMinutes}
            totalCost={convertCurrency(state.totalCost || 0)}
            setupCost={convertCurrency(state.setupCost || 0)}
            taxRate={state.taxRate}
            themeColor={state.themeColor}
            currency={state.currency}
          />
        )}

        <InvoiceHistoryList
          invoices={state.invoices}
          onEdit={(invoice) => logic.handleEdit(invoice, state.setEditingId, state.setRecalculatedId)}
          onDelete={(id) => state.setInvoices(state.invoices.filter((inv) => inv.id !== id))}
          onPrint={exportPDF}
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
