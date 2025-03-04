
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, FileDown, Eye } from "lucide-react";

interface CalculatorActionsProps {
  onCalculate: () => void;
  onPreviewToggle: () => void;
  onExportPDF: () => void;
  totalCost: number | null;
  setupCost: number | null;
  currency: string;
  totalMinutes: number;
}

export function CalculatorActions({
  onCalculate,
  onPreviewToggle,
  onExportPDF,
  totalCost,
  setupCost,
  currency,
  totalMinutes,
}: CalculatorActionsProps) {
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <Button 
          onClick={onCalculate} 
          variant="default"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculate Cost
        </Button>
        <Button 
          onClick={onPreviewToggle} 
          variant="outline"
          className="border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white font-medium px-6 py-2 rounded-lg shadow-sm transform transition-all hover:-translate-y-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          Toggle Preview
        </Button>
        <Button 
          onClick={onExportPDF} 
          variant="outline"
          className="border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white font-medium px-6 py-2 rounded-lg shadow-sm transform transition-all hover:-translate-y-1"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {totalCost !== null && setupCost !== null && (
        <div className="space-y-4">
          <div className={cn(
            "p-6 rounded-lg space-y-3",
            "bg-gradient-to-br from-white to-indigo-50",
            "shadow-md border border-indigo-100"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">Monthly Cost</p>
                <p className="text-2xl font-bold text-indigo-800">{currencySymbol} {totalCost.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">Setup Cost</p>
                <p className="text-2xl font-bold text-indigo-800">{currencySymbol} {setupCost.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">Total Minutes</p>
                <p className="text-2xl font-bold text-indigo-800">{totalMinutes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
