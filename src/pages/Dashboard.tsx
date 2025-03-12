
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";
import { InvoiceCard } from "@/components/dashboard/InvoiceCard";
import { AccountInfoCard } from "@/components/dashboard/AccountInfoCard";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { totalInvoices, userEmail } = useDashboardData();

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
