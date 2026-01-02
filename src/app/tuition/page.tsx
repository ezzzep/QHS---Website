"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getBrowserSupabase } from "@/lib/db";
import {
  GraduationCap,
  BookOpen,
  Wind,
  FileText,
  Calculator,
  CreditCard,
  Calendar,
  Award,
  Star,
  Users,
  Edit3,
  Save,
  X,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Mail,
  MessageCircle,
  UserCheck,
  FileCheck,
  Image,
  AlertCircle,
} from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";

// Type definitions
interface TuitionFee {
  id: string;
  grade: string;
  fee_name: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
}

interface GradeFees {
  id: string;
  grade: string;
  icon: React.ReactNode;
  fees: FeeItem[];
  total: number;
  note: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  discount?: string;
  schedule?: string;
  installments?: string;
  dates?: string[];
  note?: string;
  popular: boolean;
  paymentType: string;
}

interface DiscountItem {
  level: string;
  discount: string;
}

interface DiscountCategory {
  type: string;
  icon: React.ReactNode;
  items: DiscountItem[];
}

interface Requirement {
  name: string;
  icon: React.ReactNode;
}

interface AdmissionCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  requirements: Requirement[];
}

// Define the desired order of fee items
const FEE_ORDER = [
  "Tuition Fee",
  "Aircon Fee",
  "Aircon Fee / Computer Class",
  "Registration Fee & Misc. Fees",
  "Hard Copy Textbooks & Diary/Handbook",
];

const supabase: SupabaseClient = getBrowserSupabase();

export default function TuitionPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const isAdmin = user && profile?.role === "admin";

  // State for tuition fees
  const [tuitionFees, setTuitionFees] = useState<GradeFees[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to sort fees according to the predefined order
  const sortFees = (fees: FeeItem[]): FeeItem[] => {
    return [...fees].sort((a, b) => {
      const indexA = FEE_ORDER.indexOf(a.name);
      const indexB = FEE_ORDER.indexOf(b.name);

      // If both items are in the predefined order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only item A is in the predefined order, it comes first
      if (indexA !== -1) {
        return -1;
      }

      // If only item B is in the predefined order, it comes first
      if (indexB !== -1) {
        return 1;
      }

      // If neither item is in the predefined order, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  // Fetch tuition fees from Supabase
  const fetchTuitionFees = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tuition_fees")
        .select("*")
        .order("grade", { ascending: true });

      if (error) {
        throw error;
      }

      // Type assertion for the data
      const feesData = data as TuitionFee[];

      // Group the data by grade
      const groupedData: Record<string, GradeFees> = feesData.reduce(
        (acc, item) => {
          const gradeKey = item.grade;
          if (!acc[gradeKey]) {
            acc[gradeKey] = {
              id: gradeKey,
              grade: gradeKey,
              icon: getIconForGrade(gradeKey),
              fees: [],
              total: 0,
              note: "Extra Curricular Activities NOT Included",
            };
          }

          acc[gradeKey].fees.push({
            id: item.id,
            name: item.fee_name,
            amount: item.amount,
            icon: getIconForFeeName(item.fee_name),
          });

          return acc;
        },
        {} as Record<string, GradeFees>
      );

      // Sort fees for each grade according to the predefined order
      Object.values(groupedData).forEach((grade: GradeFees) => {
        grade.fees = sortFees(grade.fees);
        // Calculate total after sorting
        grade.total = grade.fees.reduce(
          (sum: number, fee: FeeItem) => sum + fee.amount,
          0
        );
      });

      // Convert to array and sort by grade
      const gradeOrder: string[] = [
        "PRE - SCHOOL",
        "GRADE I - II",
        "GRADE III - VI",
      ];
      const sortedFees: GradeFees[] = Object.values(groupedData).sort(
        (a: GradeFees, b: GradeFees) => {
          return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
        }
      );

      setTuitionFees(sortedFees);
    } catch (err) {
      console.error("Error fetching tuition fees:", err);
      setError("Failed to load tuition fees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get icon based on grade
  const getIconForGrade = (grade: string): React.ReactNode => {
    if (grade === "PRE - SCHOOL") return <Users className="w-8 h-8" />;
    if (grade === "GRADE I - II") return <Award className="w-8 h-8" />;
    if (grade === "GRADE III - VI") return <TrendingUp className="w-8 h-8" />;
    return <Calculator className="w-8 h-8" />;
  };

  // Helper function to get icon based on fee name
  const getIconForFeeName = (feeName: string): React.ReactNode => {
    if (feeName.includes("Tuition"))
      return <GraduationCap className="w-5 h-5" />;
    if (feeName.includes("Aircon") || feeName.includes("Computer"))
      return <Wind className="w-5 h-5" />;
    if (feeName.includes("Registration") || feeName.includes("Misc"))
      return <FileText className="w-5 h-5" />;
    if (
      feeName.includes("Textbook") ||
      feeName.includes("Diary") ||
      feeName.includes("Handbook")
    )
      return <BookOpen className="w-5 h-5" />;
    return <Calculator className="w-5 h-5" />;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTuitionFees();
  }, []);

  // Payment plans data
  const [paymentPlans] = useState<PaymentPlan[]>([
    {
      id: "plan-a",
      name: "Plan A",
      title: "Cash Payment",
      icon: <DollarSign className="w-6 h-6" />,
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
      icon: <CreditCard className="w-6 h-6" />,
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
      icon: <Calendar className="w-6 h-6" />,
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
  ]);

  // Discounts data
  const [discounts] = useState<DiscountCategory[]>([
    {
      type: "Academic Excellence",
      icon: <Star className="w-6 h-6" />,
      items: [
        { level: "HIGHEST Honors", discount: "50%" },
        { level: "HIGH Honors", discount: "25%" },
        { level: "Honors", discount: "15%" },
      ],
    },
    {
      type: "Transfer Students",
      icon: <Users className="w-6 h-6" />,
      items: [
        { level: "HIGHEST Honors", discount: "15%" },
        { level: "HIGH Honors", discount: "10%" },
        { level: "Honors", discount: "5%" },
      ],
    },
    {
      type: "Sibling Discount",
      icon: <Users className="w-6 h-6" />,
      items: [
        { level: "Second Child", discount: "10%" },
        { level: "Third Child", discount: "5%" },
      ],
    },
  ]);

  // Admission requirements data
  const [admissionRequirements] = useState<AdmissionCategory[]>([
    {
      id: "preschool",
      title: "PRE - SCHOOL",
      icon: <Users className="w-8 h-8" />,
      requirements: [
        {
          name: "Photocopy of Birth Certificate",
          icon: <FileCheck className="w-5 h-5" />,
        },
        {
          name: "Good Moral Character",
          icon: <UserCheck className="w-5 h-5" />,
        },
        {
          name: "Long Brown Envelope with Plastic Envelope",
          icon: <Mail className="w-5 h-5" />,
        },
        {
          name: "2pcs each of 1x1 and 2x2 ID Picture",
          icon: <Image className="w-5 h-5" />,
        },
      ],
    },
    {
      id: "grade-school",
      title: "GRADE SCHOOL (1-6)",
      subtitle: "NEW / TRANSFEREE",
      icon: <Award className="w-8 h-8" />,
      requirements: [
        {
          name: "Photocopy of Birth Certificate",
          icon: <FileCheck className="w-5 h-5" />,
        },
        {
          name: "Report Card (Form 138) with LRN",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: "Form 137 / SF10",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: "Good Moral Character",
          icon: <UserCheck className="w-5 h-5" />,
        },
        {
          name: "Long Brown Envelope with Plastic Envelope",
          icon: <Mail className="w-5 h-5" />,
        },
        {
          name: "2pcs each of 1x1 and 2x2 ID Picture",
          icon: <Image className="w-5 h-5" />,
        },
      ],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ fees: FeeItem[] }>({
    fees: [],
  });
  const [saving, setSaving] = useState<boolean>(false);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTuitionFees}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = (id: string): void => {
    const fee = tuitionFees.find((f) => f.id === id);
    if (fee) {
      setEditingId(id);
      // Ensure the fees are sorted when editing
      setEditValues({
        fees: sortFees([...fee.fees]),
      });
    }
  };

  const handleSave = async (id: string): Promise<void> => {
    try {
      setSaving(true);

      // Update each fee in the database
      const updatePromises = editValues.fees.map(async (fee: FeeItem) => {
        const { error } = await supabase
          .from("tuition_fees")
          .update({ amount: fee.amount })
          .eq("id", fee.id);

        if (error) throw error;
        return fee;
      });

      await Promise.all(updatePromises);

      // Update local state
      const updatedFees = tuitionFees.map((fee: GradeFees) => {
        if (fee.id === id) {
          // Sort the fees before updating
          const sortedFees = sortFees(editValues.fees);
          const newTotal = sortedFees.reduce(
            (sum: number, f: FeeItem) =>
              sum + (parseInt(f.amount.toString()) || 0),
            0
          );
          return {
            ...fee,
            fees: sortedFees,
            total: newTotal,
          };
        }
        return fee;
      });

      setTuitionFees(updatedFees);
      setEditingId(null);
      setEditValues({ fees: [] });
    } catch (err) {
      console.error("Error updating tuition fees:", err);
      setError("Failed to update tuition fees. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditValues({ fees: [] });
  };

  const handleFeeChange = (feeIndex: number, value: string): void => {
    const newFees = [...editValues.fees];
    newFees[feeIndex].amount = parseInt(value) || 0;
    setEditValues({ ...editValues, fees: newFees });
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount =
      typeof amount === "string" ? parseInt(amount) || 0 : amount;
    if (!numAmount || numAmount === 0) {
      return "₱0";
    }
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Calculator className="w-10 h-10" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    Tuition Fees
                  </h1>
                </div>
                <p className="text-xl text-green-100 max-w-2xl">
                  Quality education investment for your child's bright future
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-12 text-gray-50"
              preserveAspectRatio="none"
              viewBox="0 0 1440 54"
            >
              <path
                fill="currentColor"
                d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Fee Structure Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {tuitionFees.map((item: GradeFees) => (
              <div key={item.id} className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>

                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102 group">
                  {/* Header */}
                  <div className="relative h-40 bg-gradient-to-br from-green-500 to-green-600 p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex items-center justify-between h-full">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {item.grade}
                        </h2>
                      </div>
                      <div className="text-white/80">{item.icon}</div>
                    </div>
                  </div>

                  {/* Fee Details */}
                  <div className="p-6 space-y-4">
                    {(editingId === item.id ? editValues.fees : item.fees).map(
                      (fee: FeeItem, feeIndex: number) => (
                        <div
                          key={fee.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600">
                              {fee.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {fee.name}
                            </span>
                          </div>
                          {editingId === item.id ? (
                            <input
                              type="number"
                              value={fee.amount}
                              onChange={(e) =>
                                handleFeeChange(feeIndex, e.target.value)
                              }
                              className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg border border-gray-300 w-24 text-right"
                              placeholder="Amount"
                            />
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              {fee.amount
                                ? formatCurrency(fee.amount)
                                : "Not set"}
                            </span>
                          )}
                        </div>
                      )
                    )}

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-800">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(
                            editingId === item.id
                              ? editValues.fees.reduce(
                                  (sum: number, f: FeeItem) =>
                                    sum + (parseInt(f.amount.toString()) || 0),
                                  0
                                )
                              : item.total
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Note */}
                    {item.note && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800 flex items-center gap-2">
                          <span className="text-amber-600">⚠️</span>
                          {item.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Edit Controls - Fixed positioning and z-index */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20">
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(item.id)}
                            disabled={saving}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Plans Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Mode of Payment
              </h2>
              <p className="text-gray-600">
                Choose the payment option that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentPlans.map((plan: PaymentPlan) => (
                <div key={plan.id} className="relative group">
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div
                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-2xl cursor-pointer ${
                      plan.popular ? "ring-2 ring-green-400" : ""
                    }`}
                  >
                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                            {plan.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {plan.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {plan.title}
                            </p>
                          </div>
                        </div>
                        {plan.popular && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-700 font-medium mb-2">
                            {plan.description}
                          </p>
                        </div>

                        {plan.discount && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 font-semibold text-sm flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              {plan.discount}
                            </p>
                          </div>
                        )}

                        {plan.schedule && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              {plan.schedule}
                            </p>
                            {plan.installments && (
                              <p className="text-sm font-medium text-gray-800">
                                {plan.installments}
                              </p>
                            )}
                          </div>
                        )}

                        {plan.dates && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2"></p>
                            {plan.dates.map((dateLine: string, idx: number) => (
                              <p key={idx} className="text-xs text-gray-700">
                                {dateLine}
                              </p>
                            ))}
                          </div>
                        )}

                        {plan.note && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-800 flex items-center gap-2">
                              <span className="text-amber-600">ℹ️</span>
                              {plan.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Note */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800 text-center">
                <strong>Important:</strong> Only one discount is applicable per
                student. The higher discount will be applied.
              </p>
            </div>
          </div>

          {/* Admission Requirements Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Admission Requirements
              </h2>
              <p className="text-gray-600">
                Documents needed for enrollment at Queen of Heaven School of
                Cavite, Inc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {admissionRequirements.map((category: AdmissionCategory) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{category.title}</h3>
                        {category.subtitle && (
                          <p className="text-green-100">{category.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {category.requirements.map(
                        (req: Requirement, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-green-100 text-green-600">
                              {req.icon}
                            </div>
                            <span className="text-gray-700 font-medium">
                              {req.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts Section */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Available Discounts
              </h2>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-sm bg-white/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full border border-white/30">
                  Only one discount applies per student (highest discount)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {discounts.map((category: DiscountCategory, index: number) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold">{category.type}</h3>
                    </div>

                    <div className="space-y-3">
                      {category.items.map((item: DiscountItem, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {item.level}
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-bold">
                                {item.discount}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                for tuition fee only
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
