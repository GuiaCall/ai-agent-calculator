
import { Calculator } from "lucide-react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <Calculator className="w-16 h-16 text-primary" />
        <span className="text-2xl font-bold text-primary">Loading...</span>
      </div>
    </div>
  );
}
