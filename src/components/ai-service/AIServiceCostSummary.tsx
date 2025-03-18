
import { useTranslation } from "react-i18next";
import { AIProvider, AIProviderModel, LanguageCharCount, OutputType } from "@/types/aiProviders";

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
  outputTypes
}: AIServiceCostSummaryProps) {
  const { t } = useTranslation();
  
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
              {t("inputTokensCost")}: ${tokenEstimation.inputCost.toFixed(5)}
            </p>
            <p>
              {t("outputTokensCost")}: ${tokenEstimation.outputCost.toFixed(5)}
            </p>
            <p className="font-semibold">
              {t("totalCost")}: ${tokenEstimation.totalCost.toFixed(5)}
            </p>
          </div>
        )}
        
        <p className="font-semibold mt-2 pt-2 border-t border-muted-foreground/20">
          {t("estimatedMonthlyCost")}: {
            new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(aiCost)
          }
        </p>
      </div>
    </div>
  );
}
