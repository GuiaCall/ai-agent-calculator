import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, LucideIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlanFeatureProps {
  included: boolean;
  feature: string;
}

const PlanFeature = ({ included, feature }: PlanFeatureProps) => (
  <div className="flex items-center space-x-2">
    {included ? (
      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
    ) : (
      <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
    )}
    <span className={included ? "text-gray-800" : "text-gray-400"}>{feature}</span>
  </div>
);

export default function Pricing() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState<{
    plan_type: string;
    status: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      
      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);
      
      // Check current subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan_type, status')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (subError) {
        console.error("Error fetching subscription:", subError);
      } else {
        console.log("Current subscription:", subscription);
        setCurrentSubscription(subscription);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // First ensure we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        toast({
          title: t("authError"),
          description: t("pleaseLoginAgain"),
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      // Get fresh access token
      const { data: { session: freshSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError || !freshSession) {
        console.error("Error refreshing session:", refreshError);
        toast({
          title: t("sessionRefreshError"),
          description: t("pleaseLoginAgain"),
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      const accessToken = freshSession.access_token;
      console.log("Got fresh access token:", accessToken.substring(0, 10) + "...");
      
      const response = await supabase.functions.invoke('create-checkout-session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: couponCode.trim() ? { couponCode: couponCode.trim() } : {},
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to create checkout session");
      }
      
      if (!response.data.url) {
        throw new Error("No checkout URL returned");
      }
      
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Subscribe error:", error);
      toast({
        title: t("subscriptionError"),
        description: error.message || t("errorCreatingSubscription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isProActive = currentSubscription?.plan_type === 'pro' && 
                     currentSubscription?.status === 'active';

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-8 mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{t("choosePlan")}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pricingDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-6 border-2 relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{t("freePlan")}</h2>
              <p className="text-gray-600 mt-2">{t("freePlanDescription")}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600 ml-1">{t("forever")}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <PlanFeature included={true} feature={t("freeFeature1")} />
              <PlanFeature included={true} feature={t("freeFeature2")} />
              <PlanFeature included={false} feature={t("proFeature1")} />
              <PlanFeature included={false} feature={t("proFeature2")} />
              <PlanFeature included={false} feature={t("proFeature3")} />
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/calculator')}
            >
              {t("currentPlan")}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
              {t("popular")}
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{t("proPlan")}</h2>
              <p className="text-gray-600 mt-2">{t("proPlanDescription")}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-gray-600 ml-1">{t("perMonth")}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <PlanFeature included={true} feature={t("freeFeature1")} />
              <PlanFeature included={true} feature={t("freeFeature2")} />
              <PlanFeature included={true} feature={t("proFeature1")} />
              <PlanFeature included={true} feature={t("proFeature2")} />
              <PlanFeature included={true} feature={t("proFeature3")} />
            </div>

            {isProActive ? (
              <Button 
                variant="default" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {t("activeSubscription")}
              </Button>
            ) : (
              <>
                <div className="mb-4">
                  <Input
                    placeholder={t("enterCouponCode")}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    currentSubscription?.plan_type === 'pro' ? 
                      t("reactivateSubscription") : 
                      t("upgradeNow")
                  )}
                </Button>
              </>
            )}
          </Card>
        </div>

        <div className="text-center mt-12 text-gray-600 max-w-2xl mx-auto">
          <p>{t("subscriptionTerms")}</p>
          <p className="mt-2">{t("moneyBackGuarantee")}</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
