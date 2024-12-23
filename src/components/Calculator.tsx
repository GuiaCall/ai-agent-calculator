import { useEffect, useState } from "react";
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
import { Json } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

function CalculatorContent() {
  const { toast } = useToast();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state, currency: state.currency });
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscriptionAndInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();

      setIsSubscribed(subscription?.plan_type === 'pro');

      // Get invoice count
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setInvoiceCount(count || 0);
    };

    checkSubscriptionAndInvoices();
  }, []);

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
    if (!isSubscribed && invoiceCount >= 5) {
      toast({
        title: "Free plan limit reached",
        description: "Please upgrade to the Pro plan to generate more invoices.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const invoiceNumber = `INV-${format(new Date(), 'yyyyMMdd')}-${state.invoices.length + 1}`;
      const newInvoice = {
        user_id: user.id,
        invoice_number: invoiceNumber,
        total_amount: state.totalCost || 0,
        tax_rate: state.taxRate,
        margin: state.margin,
        total_minutes: state.totalMinutes,
        call_duration: state.callDuration,
        client_info: state.clientInfo,
        agency_info: state.agencyInfo,
        setup_cost: state.setupCost || 0,
        monthly_service_cost: state.totalCost || 0
      };

      const { error } = await supabase
        .from('invoices')
        .insert(newInvoice);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save invoice",
          variant: "destructive",
        });
        return;
      }

      // Refresh the invoice list after creating a new invoice
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (invoices) {
        const processedInvoices = invoices.map((inv: any) => ({
          ...inv,
          date: new Date(inv.created_at)
        }));
        state.setInvoices(processedInvoices);
      }

      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } else {
      pdf.save(`invoice-${invoice.invoice_number}.pdf`);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch invoices",
          variant: "destructive",
        });
        return;
      }

      if (invoices) {
        const processedInvoices = invoices.map((inv: any) => ({
          ...inv,
          date: new Date(inv.created_at)
        }));
        state.setInvoices(processedInvoices);
      }
    };

    fetchInvoices();
  }, []);

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
          onDelete={(id) => state.setInvoices(state.invoices.filter((inv) => inv.id !== id))}
          onPrint={exportPDF}
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
