"use client";

import { useState } from "react";
import Image from "next/image";
import { useFaculty } from "@/hooks/useFaculty";
import { useAuth } from "@/hooks/useAuth";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FacultyModal from "@/components/FacultyModal";

export default function FacultyPage() {
  const {
    faculty,
    loading,
    showModal,
    showEditModal,
    editingFaculty,
    reorderMode,
    dragOverItem,
    addFaculty,
    updateFaculty,
    openEditModal,
    deleteFaculty,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setShowModal,
    setShowEditModal,
    setReorderMode,
    setEditingFaculty,
  } = useFaculty();

  const { user, profile, loading: authLoading } = useAuth();

  const isAdmin = user && profile?.role === "admin";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto mt-4 sm:mt-8">
        <div className="mb-8 sm:mb-14 text-start">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-green-800">
            School Administration
          </h1>
        </div>

        <TestimonialCarousel />

        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-green-800">
            School Faculty
          </h1>

          {isAdmin && (
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 sm:px-6 sm:py-3 text-white font-medium hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Add Faculty</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={() => setReorderMode(!reorderMode)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-medium transition-colors cursor-pointer text-sm sm:text-base ${
                  reorderMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                <span className="hidden sm:inline">
                  {reorderMode ? "Save Order" : "Reorder"}
                </span>
                <span className="sm:hidden">
                  {reorderMode ? "Save" : "Order"}
                </span>
              </button>
            </div>
          )}
        </div>

        {reorderMode && isAdmin && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm sm:text-base">
              <strong>Reorder Mode:</strong> Drag and drop faculty cards to
              change their order. Click &quot;Save Order&quot; when done.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {faculty.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-200 shadow-md group ${
                reorderMode && isAdmin ? "cursor-move" : "cursor-pointer"
              } ${dragOverItem?.id === item.id ? "ring-4 ring-green-400" : ""}`}
              draggable={reorderMode && isAdmin}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
            >
              {reorderMode && isAdmin && (
                <div className="absolute top-2 left-2 z-10 bg-green-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm">
                  {index + 1}
                </div>
              )}

              <div className="relative h-114 sm:h-115 lg:h-115 w-full">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/school.jpg"
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  {item.name}
                </p>

                <div className="mt-4 sm:mt-6 border-t border-white/60 pt-3 sm:pt-4">
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {item.position}
                  </p>
                </div>
              </div>

              {isAdmin && !reorderMode && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-white text-blue-500 p-1.5 sm:p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    title="Edit faculty member"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => deleteFaculty(item.id)}
                    className="bg-white text-red-500 p-1.5 sm:p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete faculty member"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}

          {faculty.length === 0 && (
            <p className="col-span-full text-center text-gray-400 text-base sm:text-lg">
              No faculty members found.
            </p>
          )}
        </div>
      </div>

      <FacultyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={addFaculty}
        loading={loading}
        title="Add Faculty"
        submitText="Add Faculty"
      />

      <FacultyModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingFaculty(null);
        }}
        onSubmit={(name, position, imageFile) =>
          editingFaculty
            ? updateFaculty(editingFaculty.id, name, position, imageFile)
            : Promise.resolve(false)
        }
        loading={loading}
        initialData={editingFaculty || undefined}
        title="Edit Faculty"
        submitText="Update Faculty"
      />
    </div>
  );
}
