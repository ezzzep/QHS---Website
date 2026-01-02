import { AdmissionCategory } from "@/types/tuition";

interface AdmissionRequirementsCardProps {
  category: AdmissionCategory;
}

export default function AdmissionRequirementsCard({
  category,
}: AdmissionRequirementsCardProps) {
  const GradeIconComponent = category.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <GradeIconComponent className="w-8 h-8" />
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
          {category.requirements.map((req, idx: number) => {
            const RequirementIconComponent = req.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <RequirementIconComponent className="w-5 h-5" />
                </div>
                <span className="text-gray-700 font-medium">{req.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
