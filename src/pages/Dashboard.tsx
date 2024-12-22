import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Calculator } from "@/components/Calculator";
import { FormulaExplanation } from "@/components/FormulaExplanation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <CalculatorStateProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Calculator />
          <FormulaExplanation />
        </main>
        <Footer />
      </div>
    </CalculatorStateProvider>
  );
}