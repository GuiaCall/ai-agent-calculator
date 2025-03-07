
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FreePlanCard } from "@/components/pricing/FreePlanCard";
import { ProPlanCard } from "@/components/pricing/ProPlanCard";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { useSubscription } from "@/components/pricing/useSubscription";

export default function Pricing() {
  const { loading, couponCode, setCouponCode, handleSubscribe } = useSubscription();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PricingHeader />

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <FreePlanCard />

            {/* Pro Plan */}
            <ProPlanCard 
              loading={loading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleSubscribe={handleSubscribe}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
