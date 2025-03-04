
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MakeOperationsInputProps {
  operationsPerScenario: number;
  setOperationsPerScenario: (value: number) => void;
}

export function MakeOperationsInput({
  operationsPerScenario,
  setOperationsPerScenario,
}: MakeOperationsInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="operations">Operations per Scenario</Label>
      <Input
        id="operations"
        type="number"
        value={operationsPerScenario}
        onChange={(e) => setOperationsPerScenario(Number(e.target.value))}
        min="1"
      />
      <p className="text-sm text-gray-500">
        Enter the number of operations consumed by your Make.com scenarios
      </p>
    </div>
  );
}
