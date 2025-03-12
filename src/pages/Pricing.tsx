
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageLoader } from "@/components/layout/PageLoader";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { FreePlanCard } from "@/components/pricing/FreePlanCard";
import { ProPlanCard } from "@/components/pricing/ProPlanCard";
import { useInvoiceCount } from "@/hooks/useInvoiceCount";

export default function Pricing() {
  const [pageLoading, setPageLoading] = useState(true);
  const { totalInvoices } = useInvoiceCount();
  
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
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FreePlanCard 
              invoiceCount={totalInvoices} 
              isSubscribed={false} 
            />

            <ProPlanCard 
              isSubscribed={false}
              subscriptionStatus="inactive"
              couponCode=""
              setCouponCode={() => {}}
              loading={false}
              handleSubscribe={() => {}}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
