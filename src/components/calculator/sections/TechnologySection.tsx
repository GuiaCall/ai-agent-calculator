
import { TechnologyParameters } from "@/components/TechnologyParameters";
import { TechnologyCalculators } from "../TechnologyCalculators";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { Card } from "@/components/ui/card";

export function TechnologySection() {
  const { technologies, setTechnologies } = useCalculatorStateContext();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-background text-foreground">
        <TechnologyParameters
          technologies={technologies}
          onTechnologyChange={setTechnologies}
          onVisibilityChange={() => {}}
        />
      </Card>
      <TechnologyCalculators />
    </div>
  );
}
