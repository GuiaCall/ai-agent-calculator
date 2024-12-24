import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { useCalculatorLogic } from "./CalculatorLogic";
import { CalculatorHeader } from "./CalculatorHeader";
import { CalculatorSettings } from "../CalculatorSettings";
import { TechnologyParameters } from "../TechnologyParameters";
import { TechnologyCalculators } from "./TechnologyCalculators";
import { CalculatorActions } from "./CalculatorActions";
import { CalculatorPreview } from "./CalculatorPreview";
import { InvoiceHistoryList } from "../InvoiceHistory";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { Disclaimer } from "../Disclaimer";

export function CalculatorContent() {
  const { toast } = useToast();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state, currency: state.currency });
  const navigate = useNavigate();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscriptionAndInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();

      setIsSubscribed(subscription?.plan_type === 'pro');

      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setInvoiceCount(count || 0);
    };

    checkSubscriptionAndInvoices();
  }, []);

  const handleCalculate = async () => {
    if (!isSubscribed && invoiceCount >= 5) {
      toast({
        title: "Free plan limit reached",
        description: "Please upgrade to the Pro plan to make more calculations.",
        variant: "destructive",
        action: (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
          >
            Upgrade Now
          </button>
        ),
      });
      return;
    }
    logic.calculateCost();
  };

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

      setInvoiceCount(prev => prev + 1);

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
          onCalculate={handleCalculate}
          onPreviewToggle={() => state.setShowPreview(!state.showPreview)}
          onExportPDF={exportPDF}
          totalCost={state.totalCost}
          setupCost={state.setupCost}
          currency={state.currency}
          totalMinutes={state.totalMinutes}
        />

        {state.showPreview && (
          <CalculatorPreview
            showPreview={state.showPreview}
            agencyInfo={state.agencyInfo}
            clientInfo={state.clientInfo}
            totalMinutes={state.totalMinutes}
            totalCost={state.totalCost}
            setupCost={state.setupCost}
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