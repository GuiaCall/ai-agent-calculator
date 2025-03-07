
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FreePlanCard } from "@/components/pricing/FreePlanCard";
import { ProPlanCard } from "@/components/pricing/ProPlanCard";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { useSubscription } from "@/components/pricing/useSubscription";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const { 
    loading, 
    loadingSubscription, 
    couponCode, 
    setCouponCode, 
    handleSubscribe, 
    currentSubscription,
    testMode,
    setTestMode,
    activateTestProSubscription,
    resetToFreePlan
  } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show test mode info in the console for debugging
    console.log("Current subscription data in Pricing:", currentSubscription);
  }, [currentSubscription]);

  // Redirect to dashboard if we already have an active pro subscription
  useEffect(() => {
    if (currentSubscription && currentSubscription.plan_type === 'pro' && currentSubscription.status === 'active') {
      toast({
        title: "You're already subscribed",
        description: "You already have an active Pro subscription",
      });
      navigate('/dashboard');
    }
  }, [currentSubscription, navigate, toast]);

  if (loadingSubscription) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Safe default values for plan types
  const isFreePlan = !currentSubscription || !currentSubscription.plan_type || currentSubscription.plan_type === 'free';
  const isProPlan = currentSubscription && currentSubscription.plan_type === 'pro';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PricingHeader />

          {/* Test Mode Toggle */}
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Test Mode</h3>
                <p className="text-sm text-gray-500">Activate test mode to try subscription features without payment</p>
              </div>
              <div className="flex items-center space-x-4">
                <Switch 
                  checked={testMode} 
                  onCheckedChange={setTestMode} 
                  id="test-mode" 
                />
                <label htmlFor="test-mode" className="text-sm font-medium">
                  {testMode ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            </div>

            {testMode && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={activateTestProSubscription} 
                  disabled={loading || (isProPlan && currentSubscription?.status === 'active')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Activate Test Pro Subscription'
                  )}
                </Button>
                <Button 
                  onClick={resetToFreePlan} 
                  disabled={loading || isFreePlan}
                  variant="outline" 
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Reset to Free Plan
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <FreePlanCard isCurrentPlan={isFreePlan} />

            {/* Pro Plan */}
            <ProPlanCard 
              loading={loading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleSubscribe={testMode ? activateTestProSubscription : handleSubscribe}
              isCurrentPlan={isProPlan}
              testMode={testMode}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
