
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useCalculatorStateContext } from "../calculator/CalculatorStateContext";
import { AIServiceHeader } from "./AIServiceHeader";
import { AIServiceSelectors } from "./AIServiceSelectors";
import { AIServiceCostSummary } from "./AIServiceCostSummary";
import { useAIServiceCalculator } from "./hooks/useAIServiceCalculator";

interface AIServiceCalculatorProps {
  totalMinutes: number;
}

export function AIServiceCalculator({ totalMinutes }: AIServiceCalculatorProps) {
  const { t } = useTranslation();
  const { setTechnologies, currency } = useCalculatorStateContext();
  
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    selectedOutputType,
    setSelectedOutputType,
    aiCost,
    tokenEstimation,
    currentProviderModels,
    selectedModelDetails,
    selectedOutputTypeDetails,
    languages,
    providers,
    outputTypes
  } = useAIServiceCalculator(totalMinutes, setTechnologies);
  
  // Add a debug log to track AI Service cost updates
  useEffect(() => {
    console.log(`[AIServiceCalculator] Current AI cost: $${aiCost}`);
  }, [aiCost]);
  
  return (
    <Card className="p-6 space-y-6">
      <AIServiceHeader />
      
      <div className="space-y-4">
        <AIServiceSelectors
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedOutputType={selectedOutputType}
          setSelectedOutputType={setSelectedOutputType}
          currentProviderModels={currentProviderModels}
          selectedModelDetails={selectedModelDetails}
          selectedOutputTypeDetails={selectedOutputTypeDetails}
          languages={languages}
          providers={providers}
          outputTypes={outputTypes}
        />
        
        <AIServiceCostSummary
          selectedLanguage={selectedLanguage}
          selectedProvider={selectedProvider}
          selectedModel={selectedModel}
          selectedOutputType={selectedOutputType}
          totalMinutes={totalMinutes}
          tokenEstimation={tokenEstimation}
          aiCost={aiCost}
          languages={languages}
          providers={providers}
          currentProviderModels={currentProviderModels}
          outputTypes={outputTypes}
          currency={currency}
        />
      </div>
    </Card>
  );
}
