import { LucideIcon } from "lucide-react";

export interface TuitionFee {
  id: string;
  grade: string;
  fee_name: string;
  amount: number;
  school_year: string;
  created_at: string;
  updated_at: string;
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  icon: LucideIcon;
}

export interface GradeFees {
  id: string;
  grade: string;
  icon: LucideIcon;
  fees: FeeItem[];
  total: number;
  note: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  title: string;
  icon: LucideIcon;
  description: string;
  discount?: string;
  schedule?: string;
  installments?: string;
  dates?: string[];
  note?: string;
  popular: boolean;
  paymentType: string;
}

export interface DiscountItem {
  level: string;
  discount: string;
}

export interface DiscountCategory {
  type: string;
  icon: LucideIcon;
  items: DiscountItem[];
}

export interface Requirement {
  name: string;
  icon: LucideIcon;
}

export interface AdmissionCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  requirements: Requirement[];
}
