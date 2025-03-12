
import { Calculator } from "lucide-react";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useTranslation } from "react-i18next";

export function AuthHeader() {
  const { t } = useTranslation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg mr-2">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t("aiAgentCalculator")}
          </div>
        </div>
        <LanguageSelector />
      </div>
    </nav>
  );
}
