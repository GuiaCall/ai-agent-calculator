
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BlandAIFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
        </div>
        {t("blandAiMonthlyCost")}
      </h3>
      <p className="text-gray-600">
        {t("monthlyCost")} = $0.09 × {t("totalMinutes")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {t("blandAi")} {t("chargesFixedRate")}
      </p>
    </div>
  );
}
