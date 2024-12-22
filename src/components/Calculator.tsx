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
import { supabase } from "@/integrations/supabase/client";

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
        invoiceNumber,
        date: new Date(),
        clientInfo: state.clientInfo,
        agencyInfo: state.agencyInfo,
        totalAmount: state.totalCost,
        taxRate: state.taxRate,
        margin: state.margin,
        totalMinutes: state.totalMinutes,
        callDuration: state.callDuration
      };

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "Please login to save invoices",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase
          .from('invoices')
          .insert([{
            ...newInvoice,
            user_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;

        const updatedInvoices = [...state.invoices, { ...data, id: data.id }];
        state.setInvoices(updatedInvoices);
        pdf.save(`invoice-${invoiceNumber}.pdf`);

        toast({
          title: "Success",
          description: "Invoice saved successfully",
        });
      } catch (error) {
        console.error('Error saving invoice:', error);
        toast({
          title: "Error",
          description: "Failed to save invoice",
          variant: "destructive",
        });
      }
    } else {
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const processedInvoices = data.map((inv: any) => ({
          ...inv,
          date: new Date(inv.date)
        }));
        
        state.setInvoices(processedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
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
            themeColor={state.themeColor}
            currency={state.currency}
          />
        )}

        <InvoiceHistoryList
          invoices={state.invoices}
          onEdit={(invoice) => logic.handleEdit(invoice, state.setEditingId, state.setRecalculatedId)}
          onDelete={async (id) => {
            try {
              const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', id);

              if (error) throw error;

              state.setInvoices(state.invoices.filter((inv) => inv.id !== id));
              toast({
                title: "Success",
                description: "Invoice deleted successfully",
              });
            } catch (error) {
              console.error('Error deleting invoice:', error);
              toast({
                title: "Error",
                description: "Failed to delete invoice",
                variant: "destructive",
              });
            }
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