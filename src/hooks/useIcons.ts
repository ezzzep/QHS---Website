import {
  GraduationCap,
  BookOpen,
  Wind,
  FileText,
  Calculator,
  Award,
  TrendingUp,
  Users,
  FileCheck,
  UserCheck,
  Mail,
  Image,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export const useIcons = () => {
  const getIconForGrade = (grade: string): LucideIcon => {
    if (grade === "PRE - SCHOOL") return Users;
    if (grade === "GRADE I - II") return Award;
    if (grade === "GRADE III - VI") return TrendingUp;
    return Calculator;
  };

  const getIconForFeeName = (feeName: string): LucideIcon => {
    if (feeName.includes("Tuition")) return GraduationCap;
    if (feeName.includes("Aircon") || feeName.includes("Computer")) return Wind;
    if (feeName.includes("Registration") || feeName.includes("Misc"))
      return FileText;
    if (
      feeName.includes("Textbook") ||
      feeName.includes("Diary") ||
      feeName.includes("Handbook")
    )
      return BookOpen;
    return Calculator;
  };

  const getIconForRequirement = (requirementName: string): LucideIcon => {
    if (requirementName.includes("Birth Certificate")) return FileCheck;
    if (requirementName.includes("Good Moral")) return UserCheck;
    if (requirementName.includes("Envelope")) return Mail;
    if (requirementName.includes("Picture")) return Image;
    if (
      requirementName.includes("Report Card") ||
      requirementName.includes("Form 137") ||
      requirementName.includes("SF10")
    )
      return FileText;
    return FileCheck;
  };

  const getIconForDiscountType = (type: string): LucideIcon => {
    if (type === "Academic Excellence") return Award;
    if (type === "Transfer Students" || type === "Sibling Discount")
      return Users;
    return Award;
  };

  return {
    getIconForGrade,
    getIconForFeeName,
    getIconForRequirement,
    getIconForDiscountType,
  };
};
