
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const { totalMinutes, currency, setTechnologies } = useCalculatorStateContext();
  const { t } = useTranslation();

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      default:
        return amount;
    }
  };

  useEffect(() => {
    if (selection) {
      const totalCostPerMinute = selection.inboundVoicePrice;
      const monthlyCost = (totalMinutes * totalCostPerMinute) + selection.phoneNumberPrice;
      
      // Update the technology parameter with the monthly cost
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'twilio' ? { ...tech, costPerMinute: monthlyCost } : tech
        )
      );
    }
  }, [selection, totalMinutes, setTechnologies]);

  if (!selection) return null;
  
  const totalCostPerMinute = selection.inboundVoicePrice;
  const monthlyCost = (totalMinutes * totalCostPerMinute) + selection.phoneNumberPrice;
  const convertedMonthlyCost = getCurrencyConversion(monthlyCost);
  const phoneNumberCost = getCurrencyConversion(selection.phoneNumberPrice);
  const totalMinutesCost = getCurrencyConversion(totalMinutes * totalCostPerMinute);

  return (
    <div className="mt-2 space-y-1 bg-white text-gray-900 rounded-lg p-4 shadow-sm border border-border">
      <p className="font-medium">{t("selectedRatesFor")} {selection.country} ({selection.type}):</p>
      <ul className="list-disc pl-5">
        <li>{t("phoneNumberCost")}: {getCurrencySymbol(currency)}{phoneNumberCost.toFixed(2)}/{t("month")}</li>
        <li>{t("inboundVoice")}: {getCurrencySymbol(currency)}{getCurrencyConversion(selection.inboundVoicePrice).toFixed(4)}/{t("perMinute")}</li>
        {selection.inboundSmsPrice && (
          <li>Inbound SMS: {getCurrencySymbol(currency)}{getCurrencyConversion(selection.inboundSmsPrice).toFixed(4)}/message</li>
        )}
        <li>{t("usageCost")} ({totalMinutes} {t("totalMinutes").toLowerCase()}): {getCurrencySymbol(currency)}{totalMinutesCost.toFixed(2)}</li>
        <li className="font-semibold flex items-center gap-2">
          {t("totalMonthlyTwilioCost")}: {getCurrencySymbol(currency)}{convertedMonthlyCost.toFixed(2)}
        </li>
      </ul>
    </div>
  );
}
