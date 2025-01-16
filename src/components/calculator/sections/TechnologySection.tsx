import { TechnologyParameters } from "@/components/TechnologyParameters";
import { TechnologyCalculators } from "../TechnologyCalculators";
import { useCalculatorStateContext } from "../CalculatorStateContext";

export function TechnologySection() {
  const { technologies, setTechnologies } = useCalculatorStateContext();

  return (
    <>
      <TechnologyParameters
        technologies={technologies}
        onTechnologyChange={setTechnologies}
        onVisibilityChange={() => {}}
      />
      <TechnologyCalculators />
    </>
  );
}