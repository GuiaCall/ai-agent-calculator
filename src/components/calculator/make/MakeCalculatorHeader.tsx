
import { Button } from "@/components/ui/button";
import { ExternalLink, Workflow } from "lucide-react";
import { MAKE_PRICING_URL } from "@/constants/makePlans";

export function MakeCalculatorHeader() {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Workflow className="h-5 w-5 text-indigo-600" />
        </div>
        Make.com Operations Calculator
      </h3>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => window.open(MAKE_PRICING_URL, '_blank')}
        className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
      >
        View Pricing <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}
