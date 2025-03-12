
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorContent } from "@/components/calculator/CalculatorContent";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { LegalDisclaimer } from "@/components/gdpr/LegalDisclaimer";

export function Calculator() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <CalculatorHeader />
        <Disclaimer />
        <LegalDisclaimer />
        <Suspense fallback={<div>Loading...</div>}>
          <CalculatorContent />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
