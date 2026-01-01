import { useState } from "react";

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    position: string,
    imageFile: File | null
  ) => Promise<boolean>;
  loading: boolean;
  initialData?: {
    name: string;
    position: string;
  };
  title: string;
  submitText: string;
}

export default function FacultyModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData,
  title,
  submitText,
}: FacultyModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [position, setPosition] = useState(initialData?.position || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(name, position, imageFile);
    if (success) {
      setName("");
      setPosition("");
      setImageFile(null);
    }
  };

  const handleClose = () => {
    setName("");
    setPosition("");
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-linear-to-r from-green-600 to-green-700 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {title}
              </h2>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer text-sm sm:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position / Role
                </label>
                <input
                  type="text"
                  placeholder="Enter position or role"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer text-sm sm:text-base"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer text-sm sm:text-base"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {initialData && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep the current image
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-3 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors cursor-pointer text-sm sm:text-base"
              >
                {loading ? "Processing..." : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
