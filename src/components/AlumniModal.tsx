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

  /* =============================
     FIX: Populate form on EDIT
  ============================== */
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);

      // Check if description is in achievement format (comma-separated)
      // This will work even with a single achievement
      const desc = initialData.description.trim();

      // Check if it looks like achievements (has commas or is a short phrase)
      // This is a heuristic - you might need to adjust based on your data
      if (desc.includes(",") || desc.split(" ").length <= 5) {
        const parsedAchievements = desc
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
        if (parsedAchievements.length > 0) {
          setAchievements(parsedAchievements);
          setDescription(""); // Clear the description field since we're using achievements
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

  /* =============================
     Image handler
  ============================== */
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

  /* =============================
     Achievement handlers
  ============================== */
  const handleAddAchievement = () => {
    if (currentAchievement.trim()) {
      if (editingIndex !== null) {
        // Update existing achievement
        const updatedAchievements = [...achievements];
        updatedAchievements[editingIndex] = currentAchievement.trim();
        setAchievements(updatedAchievements);
        setEditingIndex(null);
      } else {
        // Add new achievement
        setAchievements([...achievements, currentAchievement.trim()]);
      }
      setCurrentAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
    // If we're editing this achievement, reset the editing state
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentAchievement("");
    }
    // If we're editing an achievement that comes after the removed one,
    // adjust the editing index
    else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleEditAchievement = (index: number) => {
    // Set the current achievement to the text of the clicked chip
    setCurrentAchievement(achievements[index]);
    // Mark this achievement as being edited
    setEditingIndex(index);
    // Focus on the input field
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

  /* =============================
     Validation
  ============================== */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";

    // Either description or achievements should be provided
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

    // Convert achievements array to comma-separated string for submission
    const finalDescription =
      achievements.length > 0 ? achievements.join(", ") : description;

    const success = await onSubmit(name, finalDescription, imageFile);
    if (success) handleClose();
  };

  /* =============================
     Close
  ============================== */
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <button
              onClick={handleClose}
              className="text-white text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-black">
                Full Name
              </label>
              <input
                className={`w-full border rounded-lg px-4 py-2 text-gray-800 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Achievements */}
            <div>
              <label className="text-sm font-medium text-black">
                Achievements
              </label>

              {/* Achievement Chips */}
              {achievements.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
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

                      {/* Tooltip */}
                      {hoveredChip === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                          {achievement}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAchievement(index);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Achievement Input */}
              <div className="flex gap-2">
                <input
                  ref={achievementInputRef}
                  className={`flex-1 border rounded-lg px-4 py-2 text-gray-800 ${
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
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-black">
                Profile Image {!initialData && "*"}
              </label>

              {imagePreview ? (
                <div className="relative h-48">
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
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="text-gray-600">Click to upload image</span>
                </label>
              )}

              {initialData && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              )}

              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border rounded-lg text-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60 cursor-pointer"
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
