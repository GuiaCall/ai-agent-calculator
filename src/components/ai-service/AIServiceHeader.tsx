
import { useTranslation } from "react-i18next";
import { Bot } from "lucide-react";

export function AIServiceHeader() {
  const { t } = useTranslation();
  
  return (
    <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
      <div className="bg-indigo-100 p-2 rounded-full">
        <Bot className="h-5 w-5 text-indigo-600" />
      </div>
      {t("aiServiceCalculator")}
    </h3>
  );
}
