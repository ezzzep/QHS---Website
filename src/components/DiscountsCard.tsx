import { DiscountCategory } from "@/types/tuition";
import { useIcons } from "@/hooks/useIcons";

interface DiscountsCardProps {
  discounts: DiscountCategory[];
}

export default function DiscountsCard({ discounts }: DiscountsCardProps) {
  const { getIconForDiscountType } = useIcons();

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <p className="text-sm text-white inline-block px-4 py-2 rounded-full bg-green-700 border border-gray-200 tracking-wide">
          ONLY ONE DISCOUNT APPLIES PER STUDENT (HIGHEST DISCOUNT)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {discounts.map((category: DiscountCategory, index: number) => {
          const IconComponent = getIconForDiscountType(category.type);
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm text-green-600">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.type}
                </h3>
              </div>

              <div className="space-y-3">
                {category.items.map((item, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {item.level}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
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
          );
        })}
      </div>
    </div>
  );
}
