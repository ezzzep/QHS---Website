import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { Alumni } from "@/hooks/useAlumni";

interface AlumniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    imageFile: File | null
  ) => Promise<boolean>;
  loading: boolean;
  initialData?: Alumni;
  title: string;
  submitText: string;
}

export default function AlumniModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData,
  title,
  submitText,
}: AlumniModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);
  const achievementInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);

      const desc = initialData.description.trim();

      if (desc.includes(",") || desc.split(" ").length <= 5) {
        const parsedAchievements = desc
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
        if (parsedAchievements.length > 0) {
          setAchievements(parsedAchievements);
          setDescription("");
        } else {
          setAchievements([]);
          setDescription(desc);
        }
      } else {
        setAchievements([]);
        setDescription(desc);
      }

      setImagePreview(initialData.image_url ?? null);
      setImageFile(null);
    }

    if (isOpen && !initialData) {
      setName("");
      setDescription("");
      setAchievements([]);
      setCurrentAchievement("");
      setEditingIndex(null);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = () => {
    if (currentAchievement.trim()) {
      if (editingIndex !== null) {
        const updatedAchievements = [...achievements];
        updatedAchievements[editingIndex] = currentAchievement.trim();
        setAchievements(updatedAchievements);
        setEditingIndex(null);
      } else {
        setAchievements([...achievements, currentAchievement.trim()]);
      }
      setCurrentAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentAchievement("");
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleEditAchievement = (index: number) => {
    setCurrentAchievement(achievements[index]);
    setEditingIndex(index);
    setTimeout(() => {
      achievementInputRef.current?.focus();
    }, 0);
  };

  const handleAchievementKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAchievement();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim() && achievements.length === 0) {
      newErrors.description =
        "Description or at least one achievement is required";
    }

    const hasExistingImage = Boolean(initialData?.image_url);
    const hasNewImage = Boolean(imageFile);

    if (!hasExistingImage && !hasNewImage) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const finalDescription =
      achievements.length > 0 ? achievements.join(", ") : description;
    const success = await onSubmit(name, finalDescription, imageFile);
    if (success) handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <h2 className="text-white text-lg sm:text-xl font-semibold">
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="text-white text-lg sm:text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            <div>
              <label className="text-sm sm:text-base font-medium text-black">
                Full Name
              </label>
              <input
                className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-800 text-sm sm:text-base ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm sm:text-base font-medium text-black">
                Achievements
              </label>

              {achievements.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                          editingIndex === index
                            ? "bg-blue-500 text-white"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                        onMouseEnter={() => setHoveredChip(index)}
                        onMouseLeave={() => setHoveredChip(null)}
                        onClick={() => handleEditAchievement(index)}
                        title={
                          editingIndex === index
                            ? "Currently editing"
                            : "Click to edit"
                        }
                      >
                        {index + 1}
                      </div>

                      {hoveredChip === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                          {achievement}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAchievement(index);
                        }}
                        className="absolute -top-1 sm:-top-1.5 -right-1 sm:-right-1.5 bg-red-500 text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-xs cursor-pointer"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 sm:gap-3">
                <input
                  ref={achievementInputRef}
                  className={`flex-1 border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-800 text-sm sm:text-base ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } ${editingIndex !== null ? "ring-2 ring-blue-500" : ""}`}
                  value={currentAchievement}
                  onChange={(e) => setCurrentAchievement(e.target.value)}
                  onKeyDown={handleAchievementKeyDown}
                  placeholder={
                    editingIndex !== null
                      ? "Edit achievement"
                      : "Click add to save achievement"
                  }
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="bg-blue-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
              {errors.description && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm sm:text-base font-medium text-black">
                Profile Image {!initialData && "*"}
              </label>

              {imagePreview ? (
                <div className="relative h-32 sm:h-48">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-xs sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="text-gray-600 text-sm sm:text-base">
                    Click to upload image
                  </span>
                </label>
              )}

              {initialData && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              )}

              {errors.image && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-black cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg disabled:opacity-60 cursor-pointer text-sm sm:text-base"
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
