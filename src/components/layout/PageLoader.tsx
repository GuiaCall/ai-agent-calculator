
import { Calculator } from "lucide-react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95 z-50">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <Calculator className="w-16 h-16 text-primary animate-bounce" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-primary mb-2">Loading...</span>
          <span className="text-sm text-muted-foreground">This may take a moment</span>
        </div>
      </div>
    </div>
  );
}
