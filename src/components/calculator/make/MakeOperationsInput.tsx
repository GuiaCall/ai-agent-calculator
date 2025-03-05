
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface MakeOperationsInputProps {
  operationsPerScenario: number;
  setOperationsPerScenario: (value: number) => void;
}

export function MakeOperationsInput({
  operationsPerScenario,
  setOperationsPerScenario,
}: MakeOperationsInputProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="operations">{t("operationsPerScenario")}</Label>
      <Input
        id="operations"
        type="number"
        value={operationsPerScenario}
        onChange={(e) => setOperationsPerScenario(Number(e.target.value))}
        min="1"
      />
      <p className="text-sm text-gray-500">
        {t("operationsHelp")}
      </p>
    </div>
  );
}
