
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
    callDuration, 
    totalMinutes, 
    setTechnologies 
  } = useCalculatorStateContext();
  
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].id);
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0].id);
  const [selectedOutputType, setSelectedOutputType] = useState(OUTPUT_TYPES[0].id);
  
  useEffect(() => {
    calculateAndUpdateCost();
  }, [selectedLanguage, selectedProvider, selectedOutputType, callDuration, totalMinutes]);
  
  const calculateAndUpdateCost = () => {
    const cost = calculateAICost(
      selectedLanguage,
      selectedProvider,
      callDuration,
      totalMinutes
    );
    
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === "aiservice" ? { ...tech, costPerMinute: cost } : tech
      )
    );
  };
  
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
              {t("conversationDuration")}: {callDuration} {t("minutes")}
            </p>
            <p>
              {t("totalMonthlyMinutes")}: {totalMinutes} {t("minutes")}
            </p>
            <p className="font-semibold mt-2">
              {t("estimatedMonthlyCost")}: {
                new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(
                  calculateAICost(selectedLanguage, selectedProvider, callDuration, totalMinutes)
                )
              }
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
