import { LucideIcon } from "lucide-react";
import { Award, Users } from "lucide-react";

export const FEE_ORDER = [
  "Tuition Fee",
  "Aircon Fee",
  "Aircon Fee / Computer Class",
  "Registration Fee & Misc. Fees",
  "Hard Copy Textbooks & Diary/Handbook",
];

export const GRADE_ORDER = ["PRE - SCHOOL", "GRADE I - II", "GRADE III - VI"];

export const PAYMENT_PLANS = [
  {
    id: "plan-a",
    name: "Plan A",
    title: "Cash Payment",
    description: "Full payment with discount",
    discount: "10% OFF on Tuition Fee",
    note: "Not applicable for honor students or with sibling discount",
    popular: false,
    paymentType: "Full Payment",
  },
  {
    id: "plan-b",
    name: "Plan B",
    title: "Semi-Annual Payment",
    description: "Down payment + 10 monthly installments",
    schedule: "Initial payment on April/May enrollment",
    installments: "10 monthly payments (June 1 - March 1)",
    note: "Flexible payment schedule",
    popular: true,
    paymentType: "Installment",
  },
  {
    id: "plan-c",
    name: "Plan C",
    title: "Monthly Payment",
    description: "10 monthly installments",
    schedule: "Monthly payment dates:",
    dates: [
      "May 1, June 1, July 1, August 1",
      "September 1, October 1, November 1, December 1",
      "January 1, February 1",
    ],
    note: "Extended payment period",
    popular: false,
    paymentType: "Installment",
  },
];

export const DISCOUNTS = [
  {
    type: "Academic Excellence",
    items: [
      { level: "HIGHEST Honors", discount: "50%" },
      { level: "HIGH Honors", discount: "25%" },
      { level: "Honors", discount: "15%" },
    ],
  },
  {
    type: "Transfer Students",
    items: [
      { level: "HIGHEST Honors", discount: "15%" },
      { level: "HIGH Honors", discount: "10%" },
      { level: "Honors", discount: "5%" },
    ],
  },
  {
    type: "Sibling Discount",
    items: [
      { level: "Second Child", discount: "10%" },
      { level: "Third Child", discount: "5%" },
    ],
  },
];

export const ADMISSION_REQUIREMENTS = [
  {
    id: "preschool",
    title: "PRE - SCHOOL",
    requirements: [
      {
        name: "Photocopy of Birth Certificate",
      },
      {
        name: "Good Moral Character",
      },
      {
        name: "Long Brown Envelope with Plastic Envelope",
      },
      {
        name: "2pcs each of 1x1 and 2x2 ID Picture",
      },
    ],
  },
  {
    id: "grade-school",
    title: "GRADE SCHOOL (1-6)",
    subtitle: "NEW / TRANSFEREE",
    requirements: [
      {
        name: "Photocopy of Birth Certificate",
      },
      {
        name: "Report Card (Form 138) with LRN",
      },
      {
        name: "Form 137 / SF10",
      },
      {
        name: "Good Moral Character",
      },
      {
        name: "Long Brown Envelope with Plastic Envelope",
      },
      {
        name: "2pcs each of 1x1 and 2x2 ID Picture",
      },
    ],
  },
];
