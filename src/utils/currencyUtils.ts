
import { CurrencyType } from "@/components/calculator/CalculatorState";

export function getCurrencySymbol(currency: CurrencyType): string {
  switch (currency) {
    case 'EUR':
      return '€';
    default:
      return '$';
  }
}
