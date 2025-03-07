
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FreePlanCard } from "@/components/pricing/FreePlanCard";
import { ProPlanCard } from "@/components/pricing/ProPlanCard";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { useSubscription } from "@/components/pricing/useSubscription";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { 
    loading, 
    loadingSubscription, 
    couponCode, 
    setCouponCode, 
    handleSubscribe, 
    currentSubscription
  } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show current subscription data in the console for debugging
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

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <FreePlanCard isCurrentPlan={isFreePlan} />

            {/* Pro Plan */}
            <ProPlanCard 
              loading={loading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleSubscribe={handleSubscribe}
              isCurrentPlan={isProPlan}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
