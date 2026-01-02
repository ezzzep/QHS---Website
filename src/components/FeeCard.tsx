import { GradeFees } from "@/types/tuition";
import { formatCurrency } from "@/utils/tuitionUtils";
import { Edit3, Save, X } from "lucide-react";

interface FeeCardProps {
  gradeFee: GradeFees;
  editingId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editValues: { fees: any[] };
  saving: boolean;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onFeeChange: (feeIndex: number, value: string) => void;
}

export default function FeeCard({
  gradeFee,
  editingId,
  editValues,
  saving,
  isAdmin,
  onEdit,
  onSave,
  onCancel,
  onFeeChange,
}: FeeCardProps) {
  const IconComponent = gradeFee.icon;

  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>

      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102 group">
        <div className="relative h-40 bg-gradient-to-br from-green-500 to-green-600 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10 flex items-center justify-between h-full">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {gradeFee.grade}
              </h2>
            </div>
            <div className="text-white/80">
              <IconComponent className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {(editingId === gradeFee.id ? editValues.fees : gradeFee.fees).map(
            (fee, feeIndex: number) => {
              const FeeIconComponent = fee.icon;
              return (
                <div
                  key={fee.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <FeeIconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {fee.name}
                    </span>
                  </div>
                  {editingId === gradeFee.id ? (
                    <input
                      type="number"
                      value={fee.amount}
                      onChange={(e) => onFeeChange(feeIndex, e.target.value)}
                      className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg border border-gray-300 w-24 text-right"
                      placeholder="Amount"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      {fee.amount ? formatCurrency(fee.amount) : "Not set"}
                    </span>
                  )}
                </div>
              );
            }
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  editingId === gradeFee.id
                    ? editValues.fees.reduce(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (sum: number, f: any) =>
                          sum + (parseInt(f.amount.toString()) || 0),
                        0
                      )
                    : gradeFee.total
                )}
              </span>
            </div>
          </div>

          {gradeFee.note && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 flex items-center gap-2">
                <span className="text-amber-600">⚠️</span>
                {gradeFee.note}
              </p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="absolute top-4 right-4 z-20">
            {editingId === gradeFee.id ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onSave(gradeFee.id)}
                  disabled={saving}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={onCancel}
                  disabled={saving}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onEdit(gradeFee.id)}
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
  );
}
