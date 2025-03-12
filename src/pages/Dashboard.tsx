
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";
import { AccountInfoCard } from "@/components/dashboard/AccountInfoCard";
import { InvoiceCard } from "@/components/dashboard/InvoiceCard";
import { useInvoiceCount } from "@/hooks/useInvoiceCount";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { totalInvoices } = useInvoiceCount();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    
    getUserEmail();
  }, []);

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InvoiceCard totalInvoices={totalInvoices} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AccountInfoCard userEmail={userEmail} />
        </div>
      </div>
      <Footer />
    </CalculatorStateProvider>
  );
}
