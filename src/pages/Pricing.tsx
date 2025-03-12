
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageLoader } from "@/components/layout/PageLoader";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { RefreshStatusButton } from "@/components/pricing/RefreshStatusButton";
import { FreePlanCard } from "@/components/pricing/FreePlanCard";
import { ProPlanCard } from "@/components/pricing/ProPlanCard";
import { useSubscription } from "@/hooks/useSubscription";
import { useCheckoutSuccess } from "@/hooks/useCheckoutSuccess";

export default function Pricing() {
  const [pageLoading, setPageLoading] = useState(true);
  
  const {
    loading,
    refreshingStatus,
    invoiceCount,
    couponCode,
    isSubscribed,
    subscriptionStatus,
    setCouponCode,
    handleSubscribe,
    handleRefreshStatus
  } = useSubscription();
  
  // Handle checkout success redirect
  useCheckoutSuccess(handleRefreshStatus);
  
  // Simulate initial page loading for 500ms
  useState(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  });

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PricingHeader />
          
          {isSubscribed && (
            <RefreshStatusButton 
              refreshingStatus={refreshingStatus} 
              handleRefreshStatus={handleRefreshStatus} 
            />
          )}

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FreePlanCard 
              invoiceCount={invoiceCount} 
              isSubscribed={isSubscribed} 
            />

            <ProPlanCard 
              isSubscribed={isSubscribed}
              subscriptionStatus={subscriptionStatus}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              loading={loading}
              handleSubscribe={handleSubscribe}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
