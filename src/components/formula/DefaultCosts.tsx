
import { useTranslation } from "react-i18next";

export function DefaultCosts() {
  const { t } = useTranslation();
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("defaultTechnologyCosts")}</h3>
      <p className="text-sm text-gray-500 mb-2">
        {t("defaultValuesDescription")}
      </p>
      <ul className="space-y-2 text-gray-600">
        <li>• Vapi: $0.05 {t("perMinute")}</li>
        <li>• Synthflow: $0.03 {t("perMinute")}</li>
        <li>• Twilio: $0.02 {t("perMinute")}</li>
        <li>• Cal.com: $0.01 {t("perMinute")}</li>
        <li>• Make.com: $0.02 {t("perMinute")}</li>
      </ul>
    </div>
  );
}
