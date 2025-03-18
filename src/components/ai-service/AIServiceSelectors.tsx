
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { AIProvider, AIProviderModel, LanguageCharCount, OutputType } from "@/types/aiProviders";

interface AIServiceSelectorsProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  selectedProvider: string;
  setSelectedProvider: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  selectedOutputType: string;
  setSelectedOutputType: (value: string) => void;
  currentProviderModels: AIProviderModel[];
  selectedModelDetails: AIProviderModel | undefined;
  selectedOutputTypeDetails: OutputType | undefined;
  languages: LanguageCharCount[];
  providers: AIProvider[];
  outputTypes: OutputType[];
}

export function AIServiceSelectors({
  selectedLanguage,
  setSelectedLanguage,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  selectedOutputType,
  setSelectedOutputType,
  currentProviderModels,
  selectedModelDetails,
  selectedOutputTypeDetails,
  languages,
  providers,
  outputTypes
}: AIServiceSelectorsProps) {
  const { t } = useTranslation();
  
  return (
    <>
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
              {languages.map(language => (
                <SelectItem key={language.id} value={language.id}>
                  {t(language.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("charsPerMinute")}: {languages.find(l => l.id === selectedLanguage)?.charsPerMinute}
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
              {providers.map(provider => (
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
            {outputTypes.map(type => (
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
    </>
  );
}
