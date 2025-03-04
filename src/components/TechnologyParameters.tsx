
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
      case 'GBP':
        return '£';
      default:
        return '$';
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);

  const handleToggle = (id: string) => {
    const updatedTechs = technologies.map(tech =>
      tech.id === id ? { ...tech, isSelected: !tech.isSelected } : tech
    );
    onTechnologyChange(updatedTechs);
    onVisibilityChange(id, !technologies.find(t => t.id === id)?.isSelected);
  };

  const handleCostChange = (id: string, value: string) => {
    // First, update the input value state to maintain the current input
    setInputValues(prev => ({ ...prev, [id]: value }));

    // Handle empty input
    if (value === '') {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, costPerMinute: 0 } : tech
      );
      onTechnologyChange(updatedTechs);
      return;
    }

    // Validate input format
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    // Handle special cases
    if (value === '.') {
      return; // Keep the dot but don't update the value yet
    }

    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, costPerMinute: numValue } : tech
      );
      onTechnologyChange(updatedTechs);
    }
  };

  const getDisplayValue = (tech: Technology) => {
    // If there's an active input value, use that
    if (inputValues[tech.id] !== undefined) {
      return inputValues[tech.id];
    }

    // Otherwise format the stored value
    if (tech.costPerMinute === 0) return '';
    
    const stringValue = tech.costPerMinute.toString();
    if (tech.costPerMinute < 1 && !stringValue.startsWith('0')) {
      return `0${stringValue}`;
    }
    
    return stringValue;
  };

  return (
    <Card className="p-6 space-y-4 bg-background text-foreground">
      <h3 className="text-lg font-semibold">{t('technologyParameters')}</h3>
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
    </Card>
  );
}
