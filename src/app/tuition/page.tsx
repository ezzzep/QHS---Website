"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTuitionFees } from "@/hooks/useTuitionFees";
import { useSchoolYear } from "@/hooks/useSchoolYear";
import { useIcons } from "@/hooks/useIcons";
import {
  PAYMENT_PLANS,
  DISCOUNTS,
  ADMISSION_REQUIREMENTS,
} from "@/constants/feeConstants";
import {
  AlertCircle,
  ArrowRight,
  DollarSign,
  CreditCard,
  Calendar,
} from "lucide-react";

import FeeCard from "@/components/FeeCard";
import PaymentPlanCard from "@/components/PaymentPlanCard";
import AdmissionRequirementsCard from "@/components/AdmissionRequirementsCard";
import DiscountsCard from "@/components/DiscountsCard";
import SchoolYearEditor from "@/components/SchoolYearEditor";

export default function TuitionPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const isAdmin = user && profile?.role === "admin";
  const router = useRouter();

  const {
    tuitionFees,
    loading,
    error,
    editingId,
    editValues,
    saving,
    handleEdit,
    handleSave,
    handleCancel,
    handleFeeChange,
    fetchFees,
  } = useTuitionFees();

  const {
    schoolYear,
    tempSchoolYear,
    editingSchoolYear,
    savingSchoolYear,
    setTempSchoolYear,
    setEditingSchoolYear,
    handleUpdateSchoolYear,
    handleCancelEdit,
  } = useSchoolYear();

  const { getIconForGrade, getIconForFeeName, getIconForRequirement } =
    useIcons();

  // Map payment types to icon components
  const getIconForPaymentType = (paymentType: string) => {
    switch (paymentType) {
      case "Full Payment":
        return DollarSign;
      case "Installment":
        return CreditCard;
      default:
        return Calendar;
    }
  };

  // Map discount types to icon components
  const getIconForDiscountType = (type: string) => {
    switch (type) {
      case "Academic Excellence":
        return AlertCircle;
      case "Transfer Students":
      case "Sibling Discount":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  // Enhanced payment plans with proper icon components
  const enhancedPaymentPlans = PAYMENT_PLANS.map((plan) => ({
    ...plan,
    icon: getIconForPaymentType(plan.paymentType),
  }));

  // Enhanced discounts with proper icon components
  const enhancedDiscounts = DISCOUNTS.map((discount) => ({
    ...discount,
    icon: getIconForDiscountType(discount.type),
  }));

  // Enhanced admission requirements with proper icon components
  const enhancedAdmissionRequirements = ADMISSION_REQUIREMENTS.map(
    (category) => ({
      ...category,
      icon: getIconForGrade(category.title),
      requirements: category.requirements.map((req) => ({
        ...req,
        icon: getIconForRequirement(req.name),
      })),
    })
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFees}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center gap-4 mb-4 pt-3">
                <h1 className="text-4xl sm:text-5xl font-bold">Tuition Fees</h1>
              </div>
              <SchoolYearEditor
                schoolYear={schoolYear}
                tempSchoolYear={tempSchoolYear}
                editingSchoolYear={editingSchoolYear}
                savingSchoolYear={savingSchoolYear}
                isAdmin={isAdmin}
                setTempSchoolYear={setTempSchoolYear}
                setEditingSchoolYear={setEditingSchoolYear}
                handleUpdateSchoolYear={handleUpdateSchoolYear}
                handleCancelEdit={handleCancelEdit}
              />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {tuitionFees.map((item) => (
              <FeeCard
                key={item.id}
                gradeFee={item}
                editingId={editingId}
                editValues={editValues}
                saving={saving}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onFeeChange={handleFeeChange}
              />
            ))}
          </div>

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
              {enhancedPaymentPlans.map((plan) => (
                <PaymentPlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800 text-center">
                <strong>Important:</strong> Only one discount is applicable per
                student. The higher discount will be applied.
              </p>
            </div>
          </div>

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
              {enhancedAdmissionRequirements.map((category) => (
                <AdmissionRequirementsCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Available Discounts
              </h2>
            </div>

            <DiscountsCard discounts={enhancedDiscounts} />

            <div className="text-center pt-10">
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              >
                Enroll Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Your future starts here. Connect with us today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
