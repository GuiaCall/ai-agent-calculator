
import { Suspense, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorContent } from "@/components/calculator/CalculatorContent";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { initialAgencyInfo, initialClientInfo } from "./calculator/calculatorInitialState";
import { CalculatorStateProvider } from "./calculator/CalculatorStateContext";

export function Calculator() {
  const [agencyInfo, setAgencyInfo] = useState(initialAgencyInfo);
  const [clientInfo, setClientInfo] = useState(initialClientInfo);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <CalculatorHeader 
          agencyInfo={agencyInfo}
          clientInfo={clientInfo}
          onAgencyInfoChange={setAgencyInfo}
          onClientInfoChange={setClientInfo}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <CalculatorStateProvider>
            <CalculatorContent />
          </CalculatorStateProvider>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
