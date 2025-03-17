
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

export interface TechnologyParametersProps {
  technologies: Technology[];
  onTechnologyChange: (technologies: Technology[]) => void;
  onVisibilityChange: (id: string, isVisible: boolean) => void;
}

export function TechnologyParameters({ 
  technologies, 
  onTechnologyChange,
  onVisibilityChange,
}: TechnologyParametersProps) {
  const { currency } = useCalculatorStateContext();
  const { t } = useTranslation();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
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
  
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    setInputValues({});
  }, [currency]);

  const handleToggle = (id: string) => {
    const updatedTechs = technologies.map(tech =>
      tech.id === id ? { ...tech, isSelected: !tech.isSelected } : tech
    );
    onTechnologyChange(updatedTechs);
    onVisibilityChange(id, !technologies.find(t => t.id === id)?.isSelected);
  };

  const handleCostChange = (id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));

    if (value === '') {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, costPerMinute: 0 } : tech
      );
      onTechnologyChange(updatedTechs);
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (value === '.') {
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, costPerMinute: numValue } : tech
      );
      onTechnologyChange(updatedTechs);
    }
  };

  const getDisplayValue = (tech: Technology) => {
    if (inputValues[tech.id] !== undefined) {
      return inputValues[tech.id];
    }

    const convertedValue = getCurrencyConversion(tech.costPerMinute);
    
    if (convertedValue === 0) return '';
    
    const stringValue = convertedValue.toString();
    if (convertedValue < 1 && !stringValue.startsWith('0')) {
      return `0${stringValue}`;
    }
    
    return stringValue;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('technologyStack')}</h3>
      <div className="space-y-4">
        {technologies.map((tech) => (
          <div key={tech.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={tech.isSelected}
                  onCheckedChange={() => handleToggle(tech.id)}
                  id={`toggle-${tech.id}`}
                />
                <Label htmlFor={`toggle-${tech.id}`} className="flex-1">
                  {t(tech.name)}
                </Label>
              </div>
            </div>
            {tech.isSelected && (
              <div className="ml-14 flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {currencySymbol}
                </span>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={getDisplayValue(tech)}
                    onChange={(e) => handleCostChange(tech.id, e.target.value)}
                    className="w-32 pr-8 bg-background text-foreground"
                    placeholder="0.00"
                  />
                  {tech.costPerMinute >= 0 ? (
                    <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  ) : (
                    <X className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {t('perMonth')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
