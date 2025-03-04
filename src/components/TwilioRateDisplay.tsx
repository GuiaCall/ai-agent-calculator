
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

interface TwilioRateDisplayProps {
  selection: {
    country: string;
    type: string;
    phoneNumberPrice: number;
    inboundVoicePrice: number;
    inboundSmsPrice?: number;
  } | null;
}

export function TwilioRateDisplay({ selection }: TwilioRateDisplayProps) {
  const { totalMinutes, currency } = useCalculatorStateContext();

  if (!selection) return null;
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '$';
    }
  };

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      case 'GBP':
        return amount * 0.814;
      default:
        return amount;
    }
  };

  const totalCostPerMinute = selection.inboundVoicePrice + (selection.inboundSmsPrice || 0);
  const monthlyCost = (totalMinutes * totalCostPerMinute) + selection.phoneNumberPrice;
  const convertedMonthlyCost = getCurrencyConversion(monthlyCost);
  const phoneNumberCost = getCurrencyConversion(selection.phoneNumberPrice);
  const totalMinutesCost = getCurrencyConversion(totalMinutes * totalCostPerMinute);

  return (
    <div className="mt-2 space-y-1 bg-white text-gray-900 rounded-lg p-4 shadow-sm border border-border">
      <p className="font-medium">Selected rates for {selection.country} ({selection.type}):</p>
      <ul className="list-disc pl-5">
        <li>Phone Number Cost: {getCurrencySymbol(currency)}{phoneNumberCost.toFixed(2)}/month</li>
        <li>Inbound Voice: {getCurrencySymbol(currency)}{getCurrencyConversion(selection.inboundVoicePrice).toFixed(4)}/minute</li>
        {selection.inboundSmsPrice && (
          <li>Inbound SMS: {getCurrencySymbol(currency)}{getCurrencyConversion(selection.inboundSmsPrice).toFixed(4)}/message</li>
        )}
        <li>Usage Cost ({totalMinutes} minutes): {getCurrencySymbol(currency)}{totalMinutesCost.toFixed(2)}</li>
        <li className="font-semibold flex items-center gap-2">
          Total Monthly Cost: {getCurrencySymbol(currency)}{convertedMonthlyCost.toFixed(2)}
        </li>
      </ul>
    </div>
  );
}
