
import { useTranslation } from "react-i18next";
import { AIProvider, AIProviderModel, LanguageCharCount, OutputType } from "@/types/aiProviders";
import { CurrencyType } from "@/components/calculator/CalculatorState";

interface TokenEstimation {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

interface AIServiceCostSummaryProps {
  selectedLanguage: string;
  selectedProvider: string;
  selectedModel: string;
  selectedOutputType: string;
  totalMinutes: number;
  tokenEstimation: TokenEstimation | null;
  aiCost: number;
  languages: LanguageCharCount[];
  providers: AIProvider[];
  currentProviderModels: AIProviderModel[];
  outputTypes: OutputType[];
  currency: CurrencyType;
}

export function AIServiceCostSummary({
  selectedLanguage,
  selectedProvider,
  selectedModel,
  selectedOutputType,
  totalMinutes,
  tokenEstimation,
  aiCost,
  languages,
  providers,
  currentProviderModels,
  outputTypes,
  currency = 'USD'
}: AIServiceCostSummaryProps) {
  const { t } = useTranslation();
  
  const getCurrencySymbol = (curr: CurrencyType = 'USD') => {
    switch (curr) {
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
  
  return (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <h4 className="font-medium mb-2">{t("aiCostCalculation")}</h4>
      <div className="text-sm space-y-1">
        <p>
          {t("selectedLanguage")}: {t(languages.find(l => l.id === selectedLanguage)?.name || "")}
        </p>
        <p>
          {t("selectedProvider")}: {providers.find(p => p.id === selectedProvider)?.name}
        </p>
        <p>
          {t("selectedModel")}: {currentProviderModels.find(m => m.id === selectedModel)?.name}
        </p>
        <p>
          {t("selectedOutputType")}: {t(outputTypes.find(t => t.id === selectedOutputType)?.name || "")}
        </p>
        <p>
          {t("totalMonthlyMinutes")}: {totalMinutes.toLocaleString()} {t("minutes")}
        </p>
        
        {tokenEstimation && (
          <div className="mt-2 pt-2 border-t border-muted-foreground/20">
            <p>
              {t("estimatedInputTokens")}: {tokenEstimation.inputTokens.toLocaleString()} {t("tokens")}
            </p>
            <p>
              {t("estimatedOutputTokens")}: {tokenEstimation.outputTokens.toLocaleString()} {t("tokens")}
            </p>
            <p>
              {t("inputTokensCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(tokenEstimation.inputCost).toFixed(5)}
            </p>
            <p>
              {t("outputTokensCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(tokenEstimation.outputCost).toFixed(5)}
            </p>
            <p className="font-semibold">
              {t("totalCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(tokenEstimation.totalCost).toFixed(5)}
            </p>
          </div>
        )}
        
        <p className="font-semibold mt-2 pt-2 border-t border-muted-foreground/20">
          {t("estimatedMonthlyCost")}: {
            new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(getCurrencyConversion(aiCost))
          }
        </p>
      </div>
    </div>
  );
}
