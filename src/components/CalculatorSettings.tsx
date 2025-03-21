
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
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
    <Card className="p-6 space-y-6 bg-background text-foreground">
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Settings className="h-5 w-5 text-indigo-600" />
        </div>
        {t("calculatorSettings")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="callDuration">{t("averageCallDuration")}</Label>
          <Input
            id="callDuration"
            type="number"
            value={callDuration}
            onChange={(e) => onSettingChange('callDuration', Number(e.target.value))}
            min="1"
            className="bg-background text-foreground"
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
            className="bg-background text-foreground"
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
            className="bg-background text-foreground"
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
            className="bg-background text-foreground"
          />
        </div>
      </div>
    </Card>
  );
}
