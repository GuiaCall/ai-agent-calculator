
import { TechnologyParameters } from "@/components/TechnologyParameters";
import { TechnologyCalculators } from "../TechnologyCalculators";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { Card } from "@/components/ui/card";
import { Technology } from "@/types/invoice";

export function TechnologySection() {
  const { technologies, setTechnologies } = useCalculatorStateContext();

  const handleTechnologyChange = (updatedTechnologies: Technology[]) => {
    setTechnologies(updatedTechnologies);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-background text-foreground">
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
