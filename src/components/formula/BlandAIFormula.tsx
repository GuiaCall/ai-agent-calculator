
import { MessageSquare } from "lucide-react";

export function BlandAIFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
        </div>
        Bland AI Cost Calculation
      </h3>
      <p className="text-gray-600">
        Monthly Cost = $0.09 × Total Minutes
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Bland AI charges a fixed rate of $0.09 per minute for voice calls.
      </p>
    </div>
  );
}
