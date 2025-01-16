import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";

export function PreviewSection() {
  const state = useCalculatorStateContext();

  if (!state.showPreview) return null;

  return (
    <CalculatorPreview
      showPreview={state.showPreview}
      agencyInfo={state.agencyInfo}
      clientInfo={state.clientInfo}
      totalMinutes={state.totalMinutes}
      totalCost={state.totalCost}
      setupCost={state.setupCost}
      taxRate={state.taxRate}
      themeColor={state.themeColor}
      currency={state.currency}
    />
  );
}