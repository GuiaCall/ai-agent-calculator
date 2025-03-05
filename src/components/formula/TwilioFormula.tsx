
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TwilioFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Phone className="h-5 w-5 text-indigo-600" />
        </div>
        {t("twilioCostCalculation")}
      </h3>
      <p className="text-gray-600">
        {t("baseCost")} = {t("selectedRate")} × {t("totalMinutes")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {t("twilioRateExplanation")}
      </p>
    </div>
  );
}
