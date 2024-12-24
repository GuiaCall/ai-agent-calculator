import { CalculatorStateProvider } from "./calculator/CalculatorStateContext";
import { CalculatorContent } from "./calculator/CalculatorContent";

export function Calculator() {
  return (
    <CalculatorStateProvider>
      <CalculatorContent />
    </CalculatorStateProvider>
  );
}