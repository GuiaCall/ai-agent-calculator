
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { MAKE_PRICING_URL } from "@/constants/makePlans";

export function MakeCalculatorHeader() {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Make.com Operations Calculator</h3>
      <Button 
        variant="outline"
        className="animate-pulse hover:animate-none bg-primary/10 hover:bg-primary/20 text-primary font-semibold"
        onClick={() => window.open(MAKE_PRICING_URL, '_blank')}
      >
        View Make.com Pricing <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
