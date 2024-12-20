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
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

function CalculatorContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const checkInvoiceLimit = async () => {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, invoice_limit, invoices_generated')
      .single();

    if (subscription?.plan_type === 'free' && 
        subscription?.invoices_generated >= (subscription?.invoice_limit || 3)) {
      toast({
        title: "Invoice Limit Reached",
        description: "Please upgrade to continue generating invoices",
        variant: "destructive",
      });
      navigate('/pricing');
      return false;
    }
    return true;
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

    const canProceed = await checkInvoiceLimit();
    if (!canProceed) return;

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
      
      // Save invoice data to Supabase
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          total_amount: state.totalCost,
          tax_rate: state.taxRate,
          margin: state.margin,
          total_minutes: state.totalMinutes,
          call_duration: state.callDuration
        })
        .select()
        .single();

      if (invoiceError) {
        console.error('Error saving invoice:', invoiceError);
        return;
      }

      // Save technology parameters
      const techParams = state.technologies
        .filter(tech => tech.isSelected)
        .map(tech => ({
          invoice_id: invoiceData.id,
          technology_name: tech.name,
          cost_per_minute: tech.costPerMinute,
          is_selected: tech.isSelected
        }));

      await supabase
        .from('invoice_parameters')
        .insert(techParams);

      // Update invoice count for free plan
      await supabase
        .from('subscriptions')
        .update({ invoices_generated: supabase.sql`invoices_generated + 1` })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } else {
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      const { data: invoices } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_parameters (*)
        `)
        .order('created_at', { ascending: false });

      if (invoices) {
        state.setInvoices(invoices.map(inv => ({
          ...inv,
          date: new Date(inv.created_at)
        })));
      }
    };

    loadSavedData();
  }, []);

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
            await supabase.from('invoices').delete().eq('id', id);
            state.setInvoices(state.invoices.filter((inv) => inv.id !== id));
          }}
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