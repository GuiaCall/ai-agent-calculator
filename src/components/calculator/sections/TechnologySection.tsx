
import { TechnologyParameters } from "@/components/TechnologyParameters";
import { TechnologyCalculators } from "../TechnologyCalculators";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { Card } from "@/components/ui/card";
import { Technology } from "@/types/invoice";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function TechnologySection() {
  const { 
    technologies, 
    setTechnologies,
    showTechStackWarning,
    setShowTechStackWarning
  } = useCalculatorStateContext();
  
  const { t } = useTranslation();

  // Show toast when warning appears
  useEffect(() => {
    if (showTechStackWarning) {
      toast({
        title: t("warning"),
        description: t("pleaseSelectTechnologyStack"),
        variant: "destructive",
      });
      
      // Auto-hide warning after 3 seconds
      const timer = setTimeout(() => {
        setShowTechStackWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTechStackWarning, setShowTechStackWarning, t]);

  const handleTechnologyChange = (updatedTechnologies: Technology[]) => {
    setTechnologies(updatedTechnologies);
    // Clear warning if user selects a technology
    if (updatedTechnologies.some(tech => tech.isSelected)) {
      setShowTechStackWarning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card 
        className={cn(
          "p-6 bg-background text-foreground transition-all duration-300",
          showTechStackWarning ? "border-2 border-red-500 shadow-lg ring-2 ring-red-300 animate-pulse" : ""
        )}
      >
        {showTechStackWarning && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">{t("warning")}</AlertTitle>
            <AlertDescription className="text-red-600">
              {t("pleaseSelectTechnologyStack")}
            </AlertDescription>
          </Alert>
        )}
        
        <TechnologyParameters
          technologies={technologies}
          onTechnologyChange={handleTechnologyChange}
          onVisibilityChange={() => {}}
        />
      </Card>
      <TechnologyCalculators />
    </div>
  );
}
