
import { MakePlan, MakePricingTier } from "@/types/make";

// Core plan pricing tiers (monthly)
export const MAKE_CORE_MONTHLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 10.59 },
  { operationsPerMonth: 20000, price: 18.82 },
  { operationsPerMonth: 40000, price: 34.12 },
  { operationsPerMonth: 80000, price: 64.71 },
  { operationsPerMonth: 150000, price: 116.47 },
  { operationsPerMonth: 300000, price: 214.31 },
  { operationsPerMonth: 500000, price: 338.13 },
  { operationsPerMonth: 750000, price: 486.90 },
  { operationsPerMonth: 1000000, price: 631.89 },
  { operationsPerMonth: 1500000, price: 909.92 },
  { operationsPerMonth: 2000000, price: 1162.68 }
];

// Core plan pricing tiers (yearly)
export const MAKE_CORE_YEARLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 9.00 * 12 },
  { operationsPerMonth: 20000, price: 16.00 * 12 },
  { operationsPerMonth: 40000, price: 29.00 * 12 },
  { operationsPerMonth: 80000, price: 55.00 * 12 },
  { operationsPerMonth: 150000, price: 99.00 * 12 },
  { operationsPerMonth: 300000, price: 182.16 * 12 },
  { operationsPerMonth: 500000, price: 287.41 * 12 },
  { operationsPerMonth: 750000, price: 413.87 * 12 },
  { operationsPerMonth: 1000000, price: 537.11 * 12 },
  { operationsPerMonth: 1500000, price: 773.44 * 12 },
  { operationsPerMonth: 2000000, price: 988.28 * 12 }
];

// Pro plan pricing tiers (monthly)
export const MAKE_PRO_MONTHLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 18.82 },
  { operationsPerMonth: 20000, price: 34.12 },
  { operationsPerMonth: 40000, price: 62.35 },
  { operationsPerMonth: 80000, price: 107.06 },
  { operationsPerMonth: 150000, price: 180.53 },
  { operationsPerMonth: 300000, price: 315.93 },
  { operationsPerMonth: 500000, price: 482.67 },
  { operationsPerMonth: 750000, price: 678.75 },
  { operationsPerMonth: 1000000, price: 880.86 },
  { operationsPerMonth: 1500000, price: 1268.44 },
  { operationsPerMonth: 2000000, price: 1620.79 }
];

// Pro plan pricing tiers (yearly)
export const MAKE_PRO_YEARLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 16.00 * 12 },
  { operationsPerMonth: 20000, price: 29.00 * 12 },
  { operationsPerMonth: 40000, price: 53.00 * 12 },
  { operationsPerMonth: 80000, price: 91.00 * 12 },
  { operationsPerMonth: 150000, price: 153.45 * 12 },
  { operationsPerMonth: 300000, price: 268.54 * 12 },
  { operationsPerMonth: 500000, price: 410.27 * 12 },
  { operationsPerMonth: 750000, price: 576.94 * 12 },
  { operationsPerMonth: 1000000, price: 748.73 * 12 },
  { operationsPerMonth: 1500000, price: 1078.18 * 12 },
  { operationsPerMonth: 2000000, price: 1377.67 * 12 }
];

// Teams plan pricing tiers (monthly)
export const MAKE_TEAMS_MONTHLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 34.12 },
  { operationsPerMonth: 20000, price: 62.35 },
  { operationsPerMonth: 40000, price: 116.47 },
  { operationsPerMonth: 80000, price: 203.41 },
  { operationsPerMonth: 150000, price: 343.01 },
  { operationsPerMonth: 300000, price: 600.26 },
  { operationsPerMonth: 500000, price: 917.06 },
  { operationsPerMonth: 750000, price: 1289.62 },
  { operationsPerMonth: 1000000, price: 1647.85 },
  { operationsPerMonth: 1500000, price: 2317.29 },
  { operationsPerMonth: 2000000, price: 2883.74 },
  { operationsPerMonth: 2500000, price: 3540.30 },
  { operationsPerMonth: 3000000, price: 4055.26 },
  { operationsPerMonth: 4000000, price: 5181.72 },
  { operationsPerMonth: 5000000, price: 6274.73 },
  { operationsPerMonth: 6000000, price: 7461.67 },
  { operationsPerMonth: 7000000, price: 8503.52 },
  { operationsPerMonth: 8000000, price: 9683.59 }
];

// Teams plan pricing tiers (yearly)
export const MAKE_TEAMS_YEARLY_TIERS: MakePricingTier[] = [
  { operationsPerMonth: 10000, price: 29.00 * 12 },
  { operationsPerMonth: 20000, price: 53.00 * 12 },
  { operationsPerMonth: 40000, price: 99.00 * 12 },
  { operationsPerMonth: 80000, price: 172.90 * 12 },
  { operationsPerMonth: 150000, price: 291.56 * 12 },
  { operationsPerMonth: 300000, price: 510.22 * 12 },
  { operationsPerMonth: 500000, price: 779.50 * 12 },
  { operationsPerMonth: 750000, price: 1096.18 * 12 },
  { operationsPerMonth: 1000000, price: 1400.67 * 12 },
  { operationsPerMonth: 1500000, price: 1969.70 * 12 },
  { operationsPerMonth: 2000000, price: 2451.18 * 12 },
  { operationsPerMonth: 2500000, price: 3009.26 * 12 },
  { operationsPerMonth: 3000000, price: 3446.97 * 12 },
  { operationsPerMonth: 4000000, price: 4404.46 * 12 },
  { operationsPerMonth: 5000000, price: 5333.52 * 12 },
  { operationsPerMonth: 6000000, price: 6342.42 * 12 },
  { operationsPerMonth: 7000000, price: 7227.99 * 12 },
  { operationsPerMonth: 8000000, price: 8231.05 * 12 }
];

// Original legacy plans (kept for backwards compatibility)
export const MAKE_PLANS: MakePlan[] = [
  {
    name: "Core",
    operationsPerMonth: 10000,
    monthlyPrice: 10.59,
    yearlyPrice: 9.00 * 12
  },
  {
    name: "Pro",
    operationsPerMonth: 10000,
    monthlyPrice: 18.82,
    yearlyPrice: 16.00 * 12
  },
  {
    name: "Teams",
    operationsPerMonth: 10000,
    monthlyPrice: 34.12,
    yearlyPrice: 29.00 * 12
  }
];

// Calculate savings percentage between monthly and yearly pricing
export const calculateSavingsPercentage = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyTotal = monthlyPrice * 12;
  const yearlyTotal = yearlyPrice; // Yearly price is already annual in our data structure
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
};

export const MAKE_PRICING_URL = "https://rb.gy/8nusbv";
