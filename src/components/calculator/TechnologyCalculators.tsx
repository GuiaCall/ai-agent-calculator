
import React from 'react';
import { useCalculatorStateContext } from './CalculatorStateContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MakeCalculator } from './make/MakeCalculator';
import { CalcomCalculator } from '@/components/CalcomCalculator';
import { TwilioCalculator } from '@/components/TwilioCalculator';
import { VapiCalculator } from '@/components/VapiCalculator';
import { BlandAICalculator } from '@/components/BlandAICalculator';
import { SynthflowCalculator } from '@/components/SynthflowCalculator';
import { AIServiceCalculator } from '@/components/AIServiceCalculator';
import { useTranslation } from 'react-i18next';

export function TechnologyCalculators() {
  const { t } = useTranslation();
  const { technologies } = useCalculatorStateContext();

  // Filter selected technologies
  const selectedTechnologies = technologies.filter(tech => tech.isSelected);

  if (selectedTechnologies.length === 0) {
    return (
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle>{t("noTechnologySelected")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("selectTechnologyMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {selectedTechnologies.map(tech => (
        <Card key={tech.id} id={`technology-${tech.id}`} className="bg-background text-foreground overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle>{tech.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {tech.id === 'make' && <MakeCalculator />}
            {tech.id === 'cal' && <CalcomCalculator />}
            {tech.id === 'twilio' && <TwilioCalculator />}
            {tech.id === 'vapi' && <VapiCalculator />}
            {tech.id === 'blandai' && <BlandAICalculator />}
            {tech.id === 'synthflow' && <SynthflowCalculator />}
            {tech.id === 'ai-service' && <AIServiceCalculator />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
