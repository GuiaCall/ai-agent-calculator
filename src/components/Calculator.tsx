
import { useState, useEffect } from "react";
import { CalculatorStateProvider } from "./calculator/CalculatorStateContext";
import { CalculatorContent } from "./calculator/CalculatorContent";
import { PageLoader } from "./layout/PageLoader";

export function Calculator() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure context is fully initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady) {
    return <PageLoader />;
  }
  
  return (
    <CalculatorStateProvider>
      <CalculatorContent />
    </CalculatorStateProvider>
  );
}
