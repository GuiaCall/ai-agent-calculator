
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface CalculatorSettingsProps {
  callDuration: number;
  totalMinutes: number;
  margin: number;
  taxRate: number;
  onSettingChange: (setting: string, value: number) => void;
}

export function CalculatorSettings({
  callDuration,
  totalMinutes,
  margin,
  taxRate,
  onSettingChange,
}: CalculatorSettingsProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">{t("calculatorSettings")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="callDuration">{t("averageCallDuration")}</Label>
          <Input
            id="callDuration"
            type="number"
            value={callDuration}
            onChange={(e) => onSettingChange('callDuration', Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalMinutes">{t("totalMinutesPerMonth")}</Label>
          <Input
            id="totalMinutes"
            type="number"
            value={totalMinutes}
            onChange={(e) => onSettingChange('totalMinutes', Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="margin">{t("margin")}</Label>
          <Input
            id="margin"
            type="number"
            value={margin}
            onChange={(e) => onSettingChange('margin', Number(e.target.value))}
            min="0"
            max="100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxRate">{t("taxRate")}</Label>
          <Input
            id="taxRate"
            type="number"
            value={taxRate}
            onChange={(e) => onSettingChange('taxRate', Number(e.target.value))}
            min="0"
            max="100"
          />
        </div>
      </div>
    </Card>
  );
}
