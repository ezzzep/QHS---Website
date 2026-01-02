import { FEE_ORDER } from "@/constants/feeConstants";
import { FeeItem } from "@/types/tuition";

export const sortFees = (fees: FeeItem[]): FeeItem[] => {
  return [...fees].sort((a, b) => {
    const indexA = FEE_ORDER.indexOf(a.name);
    const indexB = FEE_ORDER.indexOf(b.name);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    }

    if (indexB !== -1) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
};

export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === "string" ? parseInt(amount) || 0 : amount;
  if (!numAmount || numAmount === 0) {
    return "₱0";
  }
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(numAmount);
};

export const generateYearOptions = (): string[] => {
  const options = [];
  for (let year = 2025; year <= 2050; year++) {
    options.push(`${year}-${year + 1}`);
  }
  return options;
};
