import { Edit3, Save, X } from "lucide-react";
import { generateYearOptions } from "@/utils/tuitionUtils";

interface SchoolYearEditorProps {
  schoolYear: string;
  tempSchoolYear: string;
  editingSchoolYear: boolean;
  savingSchoolYear: boolean;
  isAdmin: boolean;
  setTempSchoolYear: (year: string) => void;
  setEditingSchoolYear: (editing: boolean) => void;
  handleUpdateSchoolYear: () => void;
  handleCancelEdit: () => void;
}

export default function SchoolYearEditor({
  schoolYear,
  tempSchoolYear,
  editingSchoolYear,
  savingSchoolYear,
  isAdmin,
  setTempSchoolYear,
  setEditingSchoolYear,
  handleUpdateSchoolYear,
  handleCancelEdit,
}: SchoolYearEditorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      <p className="text-lg sm:text-xl text-green-100">For school year of</p>
      {isAdmin ? (
        <div className="flex items-center gap-2">
          {editingSchoolYear ? (
            <>
              <div className="relative">
                <select
                  value={tempSchoolYear || "2025-2026"}
                  onChange={(e) => setTempSchoolYear(e.target.value)}
                  disabled={savingSchoolYear}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-6 sm:px-8 py-1.5 sm:py-1 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer text-sm sm:text-base"
                >
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year} className="text-gray-800">
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {savingSchoolYear && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-lg">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={handleUpdateSchoolYear}
                disabled={savingSchoolYear}
                className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                title="Save School Year"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={savingSchoolYear}
                className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </>
          ) : (
            <>
              <span className="text-lg sm:text-xl text-green-100 font-semibold">
                {schoolYear || "2025-2026"}
              </span>
              <button
                onClick={() => setEditingSchoolYear(true)}
                className="p-1.5 sm:p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all shadow-lg border border-white/30 cursor-pointer"
                title="Edit School Year"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <span className="text-lg sm:text-xl text-green-100 font-semibold">
          {schoolYear || "2025-2026"}
        </span>
      )}
    </div>
  );
}
