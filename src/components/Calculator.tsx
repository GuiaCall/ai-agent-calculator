
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorContent } from "@/components/calculator/CalculatorContent";
import { CalculatorStateProvider } from "./calculator/CalculatorStateContext";

export function Calculator() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
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
