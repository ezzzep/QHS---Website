import { PaymentPlan } from "@/types/tuition";
import { DollarSign, CreditCard, Calendar, CheckCircle } from "lucide-react";

interface PaymentPlanCardProps {
  plan: PaymentPlan;
}

export default function PaymentPlanCard({ plan }: PaymentPlanCardProps) {
  const getIcon = () => {
    if (plan.paymentType === "Full Payment")
      return <DollarSign className="w-6 h-6" />;
    if (plan.paymentType === "Installment")
      return <CreditCard className="w-6 h-6" />;
    return <Calendar className="w-6 h-6" />;
  };

  return (
    <div className="relative group">
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-green-600 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap">
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
                {getIcon()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.title}</p>
              </div>
            </div>
            {plan.popular && <CheckCircle className="w-6 h-6 text-green-500" />}
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
                <p className="text-sm text-gray-600 mb-1">{plan.schedule}</p>
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
  );
}
