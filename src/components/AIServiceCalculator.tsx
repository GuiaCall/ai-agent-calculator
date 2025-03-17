
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { AI_PROVIDERS, LANGUAGES, OUTPUT_TYPES, calculateAICost } from "@/constants/aiProviders";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

export function AIServiceCalculator() {
  const { t } = useTranslation();
  const { 
    totalMinutes, 
    setTechnologies 
  } = useCalculatorStateContext();
  
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
    
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === "aiservice" ? { ...tech, costPerMinute: cost } : tech
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
  
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">{t("aiServiceCalculator")}</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language-select">{t("languageSelection")}</Label>
            <Select 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger id="language-select">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(language => (
                  <SelectItem key={language.id} value={language.id}>
                    {t(language.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("charsPerMinute")}: {LANGUAGES.find(l => l.id === selectedLanguage)?.charsPerMinute}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider-select">{t("serviceProvider")}</Label>
            <Select 
              value={selectedProvider} 
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger id="provider-select">
                <SelectValue placeholder={t("selectProvider")} />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-select">{t("modelSelection")}</Label>
          <Select 
            value={selectedModel} 
            onValueChange={setSelectedModel}
          >
            <SelectTrigger id="model-select">
              <SelectValue placeholder={t("selectModel")} />
            </SelectTrigger>
            <SelectContent>
              {currentProviderModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedModelDetails && (
            <p className="text-xs text-muted-foreground">
              {t("pricing")}: {t("input")} ${selectedModelDetails.pricing.input.toFixed(2)}/M {t("tokens")}, {t("output")} ${selectedModelDetails.pricing.output.toFixed(2)}/M {t("tokens")}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="output-type-select">{t("outputType")}</Label>
          <Select 
            value={selectedOutputType} 
            onValueChange={setSelectedOutputType}
          >
            <SelectTrigger id="output-type-select">
              <SelectValue placeholder={t("selectOutputType")} />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {t(type.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOutputTypeDetails && (
            <p className="text-xs text-muted-foreground">
              {t("outputCharCount")}: {selectedOutputTypeDetails.charCount} {t("characters")}
            </p>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">{t("aiCostCalculation")}</h4>
          <div className="text-sm space-y-1">
            <p>
              {t("selectedLanguage")}: {t(LANGUAGES.find(l => l.id === selectedLanguage)?.name || "")}
            </p>
            <p>
              {t("selectedProvider")}: {AI_PROVIDERS.find(p => p.id === selectedProvider)?.name}
            </p>
            <p>
              {t("selectedModel")}: {currentProviderModels.find(m => m.id === selectedModel)?.name}
            </p>
            <p>
              {t("selectedOutputType")}: {t(OUTPUT_TYPES.find(t => t.id === selectedOutputType)?.name || "")}
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
      </div>
    </Card>
  );
}
