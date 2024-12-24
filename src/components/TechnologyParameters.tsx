import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { useTranslation } from "react-i18next";

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
  
  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedTechnologies = localStorage.getItem('calculatorTechnologies');
    if (savedTechnologies) {
      onTechnologyChange(JSON.parse(savedTechnologies));
    }
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calculatorTechnologies', JSON.stringify(technologies));
  }, [technologies]);
  
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
    // Allow decimal input
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    
    // Handle multiple decimal points
    const parts = sanitizedValue.split('.');
    const cleanValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Convert to number and update state
    const numValue = cleanValue === '' ? 0 : parseFloat(cleanValue);
    
    if (!isNaN(numValue)) {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, costPerMinute: numValue } : tech
      );
      onTechnologyChange(updatedTechs);
    }
  };

  const formatValue = (value: number) => {
    if (value === 0) return '';
    // Format number to show up to 4 decimal places if they exist
    return value.toString().includes('.') 
      ? value.toFixed(Math.min(4, value.toString().split('.')[1].length))
      : value.toString();
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
                    value={formatValue(tech.costPerMinute)}
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
                  {t('perMinute')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}