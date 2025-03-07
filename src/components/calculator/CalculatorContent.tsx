
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CalculatorContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const navigate = useNavigate();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  useEffect(() => {
    const checkSubscriptionAndInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get subscription details
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsSubscribed(subscription?.plan_type === 'pro');
      setIsSubscriptionActive(subscription?.status === 'active');

      // Get invoice count
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      setInvoiceCount(count || 0);
    };

    checkSubscriptionAndInvoices();

    // Subscribe to subscription changes
    const subscriptionChannel = supabase
      .channel('user_subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected in calculator:', payload);
          checkSubscriptionAndInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChannel);
    };
  }, []);

  const handleCalculate = async () => {
    // Check if user is on free plan, has reached limit, and is not editing an existing invoice
    if (!isSubscribed && invoiceCount >= 5 && !state.editingInvoice) {
      toast({
        title: t("freePlanLimit"),
        description: t("pleaseUpgrade"),
        variant: "destructive",
        action: (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
          >
            {t("upgradeNow")}
          </button>
        ),
      });
      return;
    }

    // Check if subscription is inactive
    if (isSubscribed && !isSubscriptionActive) {
      toast({
        title: t("subscriptionInactive"),
        description: t("subscriptionReactivate"),
        variant: "warning",
        action: (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
          >
            {t("reactivateNow")}
          </button>
        ),
      });
      return;
    }

    logic.calculateCost();
  };

  if (state.isLoading) {
    return (
      <>
        <Navbar />
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{t("loadingCalculatorData")}</p>
        </div>
        <Footer />
      </>
    );
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
