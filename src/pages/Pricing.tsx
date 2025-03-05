
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInvoiceCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setInvoiceCount(count || 0);
    };

    fetchInvoiceCount();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      
      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("pricingTitle")}</h1>
          <p className="text-gray-600">{t("pricingDescription")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 border-2 hover:border-primary transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{t("freePlan")}</h3>
              <p className="text-gray-600 mb-4">{t("freePlanDescription")}</p>
              <div className="text-3xl font-bold">€0/{t("month")}</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("generateUpToFiveInvoices", { count: invoiceCount, total: 5 })}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("basicInvoiceGeneration")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("pdfExportFunctionality")}</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" disabled>
              {t("currentPlan")}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{t("proPlan")}</h3>
              <p className="text-gray-600 mb-4">{t("proPlanDescription")}</p>
              <div className="text-3xl font-bold">€7.99/{t("month")}</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("generateUnlimitedInvoices")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("accessToAllFeatures")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("futureFeatureUpgrades")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("pdfExportFunctionality")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{t("accessToAllSavedInvoices")}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? t("processing") : t("upgradeToPro")}
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
