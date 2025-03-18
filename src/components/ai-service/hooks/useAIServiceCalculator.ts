
import { useState, useEffect } from "react";
import { AI_PROVIDERS, LANGUAGES, OUTPUT_TYPES, calculateAICost } from "@/constants/aiProviders";
import { AIProvider, AIProviderModel, LanguageCharCount, OutputType } from "@/types/aiProviders";

export function useAIServiceCalculator(
  totalMinutes: number, 
  setTechnologies: (techs: any) => void
) {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].id);
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0].id);
  const [selectedModel, setSelectedModel] = useState(AI_PROVIDERS[0].models[0].id);
  const [selectedOutputType, setSelectedOutputType] = useState(OUTPUT_TYPES[0].id);
  const [aiCost, setAiCost] = useState(0);
  
  // Update available models when provider changes
  useEffect(() => {
    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (provider && provider.models.length > 0) {
      setSelectedModel(provider.models[0].id);
    }
  }, [selectedProvider]);
  
  useEffect(() => {
    calculateAndUpdateCost();
  }, [selectedLanguage, selectedProvider, selectedModel, selectedOutputType, totalMinutes]);
  
  const calculateAndUpdateCost = () => {
    const cost = calculateAICost(
      selectedLanguage,
      selectedProvider,
      selectedModel,
      totalMinutes,
      selectedOutputType
    );
    
    setAiCost(cost);
    
    setTechnologies((techs: any) => 
      techs.map((tech: any) => 
        tech.id === "ai-service" ? { ...tech, costPerMinute: cost / (totalMinutes || 1) } : tech
      )
    );
  };
  
  // Get current provider models
  const currentProviderModels = AI_PROVIDERS.find(
    p => p.id === selectedProvider
  )?.models || [];
  
  // Get selected model details
  const selectedModelDetails = currentProviderModels.find(
    m => m.id === selectedModel
  );
  
  // Get selected output type details
  const selectedOutputTypeDetails = OUTPUT_TYPES.find(
    t => t.id === selectedOutputType
  );
  
  // Calculate estimated tokens and costs for display
  const getTokenEstimation = () => {
    const selectedLang = LANGUAGES.find(l => l.id === selectedLanguage);
    if (!selectedLang || !selectedModelDetails || !selectedOutputTypeDetails) return null;
    
    const charsPerMin = selectedLang.charsPerMinute;
    const totalInputChars = charsPerMin * totalMinutes;
    const totalInputTokens = Math.round(totalInputChars / 4);
    
    const outputChars = selectedOutputTypeDetails.charCount * (totalMinutes / 5); // Estimate one output per 5 minutes of conversation
    const outputTokens = Math.round(outputChars / 4);
    
    const inputCost = (totalInputTokens * selectedModelDetails.pricing.input) / 1_000_000;
    const outputCost = (outputTokens * selectedModelDetails.pricing.output) / 1_000_000;
    
    return {
      inputTokens: totalInputTokens,
      outputTokens: outputTokens,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost
    };
  };
  
  const tokenEstimation = getTokenEstimation();
  
  return {
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
    languages: LANGUAGES,
    providers: AI_PROVIDERS,
    outputTypes: OUTPUT_TYPES
  };
}
