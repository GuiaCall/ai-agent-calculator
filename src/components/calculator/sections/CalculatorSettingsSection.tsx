import { CalculatorSettings } from "@/components/CalculatorSettings";
import { useCalculatorStateContext } from "../CalculatorStateContext";

export function CalculatorSettingsSection() {
  const state = useCalculatorStateContext();

  const handleSettingChange = (setting: string, value: number) => {
    switch (setting) {
      case 'callDuration':
        state.setCallDuration(value);
        break;
      case 'totalMinutes':
        state.setTotalMinutes(value);
        break;
      case 'margin':
        state.setMargin(value);
        break;
      case 'taxRate':
        state.setTaxRate(value);
        break;
    }
  };

  return (
    <CalculatorSettings
      callDuration={state.callDuration}
      totalMinutes={state.totalMinutes}
      margin={state.margin}
      taxRate={state.taxRate}
      onSettingChange={handleSettingChange}
    />
  );
}