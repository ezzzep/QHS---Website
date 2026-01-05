import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";

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
  const [name, setName] = useState("");
  const [positions, setPositions] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);
  const positionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);

      const pos = initialData.position.trim();
      if (pos.includes(",")) {
        const parsedPositions = pos
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p);
        setPositions(parsedPositions);
      } else {
        setPositions([pos]);
      }

      setImagePreview(null);
      setImageFile(null);
      setCurrentPosition("");
      setEditingIndex(null);
    }

    if (isOpen && !initialData) {
      setName("");
      setPositions([]);
      setCurrentPosition("");
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

  const handleAddPosition = () => {
    if (currentPosition.trim()) {
      if (editingIndex !== null) {
        const updatedPositions = [...positions];
        updatedPositions[editingIndex] = currentPosition.trim();
        setPositions(updatedPositions);
        setEditingIndex(null);
      } else {
        setPositions([...positions, currentPosition.trim()]);
      }
      setCurrentPosition("");
    }
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentPosition("");
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleEditPosition = (index: number) => {
    setCurrentPosition(positions[index]);
    setEditingIndex(index);
    setTimeout(() => {
      positionInputRef.current?.focus();
    }, 0);
  };

  const handlePositionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPosition();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (positions.length === 0)
      newErrors.position = "At least one position is required";

    const hasExistingImage = Boolean(initialData);
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

    const finalPosition = positions.join(", ");

    const success = await onSubmit(name, finalPosition, imageFile);
    if (success) handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <button
              onClick={handleClose}
              className="text-white text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

            <div>
              <label className="text-sm font-medium text-black">
                Position / Role
              </label>

              {positions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {positions.map((position, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                          editingIndex === index
                            ? "bg-blue-500 text-white"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                        onMouseEnter={() => setHoveredChip(index)}
                        onMouseLeave={() => setHoveredChip(null)}
                        onClick={() => handleEditPosition(index)}
                        title={
                          editingIndex === index
                            ? "Currently editing"
                            : "Click to edit"
                        }
                      >
                        {index + 1}
                      </div>

                      {hoveredChip === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                          {position}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePosition(index);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={positionInputRef}
                  className={`flex-1 border rounded-lg px-4 py-2 text-gray-800 ${
                    errors.position ? "border-red-500" : "border-gray-300"
                  } ${editingIndex !== null ? "ring-2 ring-blue-500" : ""}`}
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  onKeyDown={handlePositionKeyDown}
                  placeholder={
                    editingIndex !== null ? "Edit position" : "Click add to save position"
                  }
                />
                <button
                  type="button"
                  onClick={handleAddPosition}
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position}</p>
              )}
            </div>

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
