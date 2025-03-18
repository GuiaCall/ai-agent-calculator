
import { TFunction } from "i18next";

interface SynthflowUsageSummaryProps {
  totalMinutes: number;
  t: TFunction;
}

export function SynthflowUsageSummary({ totalMinutes, t }: SynthflowUsageSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border">
      <div>
        <p className="text-sm text-muted-foreground">
          {t("basedOnUsage")}: <span className="font-medium">{totalMinutes.toLocaleString()} {t("minutesPerMonth")}</span>
        </p>
      </div>
    </div>
  );
}
