
import { useTranslation } from "react-i18next";

export function PricingHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-6">{t("pricingTitle")}</h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("pricingDescription")}</p>
    </div>
  );
}
