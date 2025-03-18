
import React, { useEffect } from 'react';
import { useCalculatorStateContext } from './CalculatorStateContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MakeCalculator } from './make/MakeCalculator';
import { CalcomCalculator } from '@/components/CalcomCalculator';
import { TwilioCalculator } from '@/components/TwilioCalculator';
import { VapiCalculator } from '@/components/VapiCalculator';
import { BlandAICalculator } from '@/components/BlandAICalculator';
import { SynthflowCalculator } from '@/components/synthflow/SynthflowCalculator';
import { AIServiceCalculator } from '@/components/ai-service/AIServiceCalculator';
import { useTranslation } from 'react-i18next';
import { MakePlan } from '@/types/make';
import { CalcomPlan } from '@/types/calcom';
import { SynthflowPlan } from '@/types/synthflow';
import { TwilioSelection } from '@/types/twilio';

export function TechnologyCalculators() {
  const { t } = useTranslation();
  const { 
    technologies,
    callDuration,
    totalMinutes,
    setSelectedMakePlan,
    setSelectedCalcomPlan,
    setSelectedTwilioRate,
    setSelectedSynthflowPlan,
    setTechnologies,
    numberOfUsers,
    setNumberOfUsers
  } = useCalculatorStateContext();

  // Filter selected technologies
  const selectedTechnologies = technologies.filter(tech => tech.isSelected);

  // Handler functions for each calculator
  const handleMakePlanSelect = (plan: MakePlan) => {
    setSelectedMakePlan(plan);
  };

  const handleMakeCostPerMinuteChange = (cost: number) => {
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === 'make' ? { ...tech, costPerMinute: cost } : tech
      )
    );
  };

  const handleCalcomPlanSelect = (plan: CalcomPlan, users: number) => {
    setSelectedCalcomPlan(plan);
    setNumberOfUsers(users);
    
    const monthlyTotal = plan.basePrice + (plan.allowsTeam ? users * plan.pricePerUser : 0);
    
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === 'calcom' || tech.id === 'cal' ? { ...tech, costPerMinute: monthlyTotal / (totalMinutes || 1) } : tech
      )
    );
  };

  const handleTwilioRateSelect = (selection: TwilioSelection | null) => {
    setSelectedTwilioRate(selection);
    
    if (selection) {
      const costPerMinute = Math.ceil((selection.inboundVoicePrice + (selection.inboundSmsPrice || 0)) * 1000) / 1000;
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'twilio' ? { ...tech, costPerMinute } : tech
        )
      );
    }
  };

  const handleSynthflowPlanSelect = (plan: SynthflowPlan | null) => {
    setSelectedSynthflowPlan(plan);
    
    if (plan) {
      const costPerMinute = plan.totalCost ? plan.totalCost / (totalMinutes || 1) : plan.monthlyPrice / (plan.minutesPerMonth || 1);
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'synthflow' ? { ...tech, costPerMinute } : tech
        )
      );
    }
  };

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
            {tech.id === 'make' && (
              <MakeCalculator 
                totalMinutes={totalMinutes}
                averageCallDuration={callDuration}
                onPlanSelect={handleMakePlanSelect}
                onCostPerMinuteChange={handleMakeCostPerMinuteChange}
              />
            )}
            
            {(tech.id === 'cal' || tech.id === 'calcom') && (
              <CalcomCalculator 
                onPlanSelect={handleCalcomPlanSelect}
                totalMinutes={totalMinutes}
                margin={20}
              />
            )}
            
            {tech.id === 'twilio' && (
              <TwilioCalculator 
                onRateSelect={handleTwilioRateSelect}
              />
            )}
            
            {tech.id === 'vapi' && <VapiCalculator />}
            
            {tech.id === 'blandai' && <BlandAICalculator />}
            
            {tech.id === 'synthflow' && (
              <SynthflowCalculator 
                totalMinutes={totalMinutes}
                onPlanSelect={handleSynthflowPlanSelect}
              />
            )}
            
            {tech.id === 'ai-service' && (
              <AIServiceCalculator 
                totalMinutes={totalMinutes}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
