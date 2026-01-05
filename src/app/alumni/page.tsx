"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAlumni } from "@/hooks/useAlumni";
import { useAuth } from "@/hooks/useAuth";
import AlumniModal from "@/components/AlumniModal";

export default function AlumniPage() {
  const {
    alumni,
    loading,
    showModal,
    showEditModal,
    editingAlumni,
    refreshAlumni,
    addAlumni,
    updateAlumni,
    openEditModal,
    deleteAlumni,
    setShowModal,
    setShowEditModal,
    setEditingAlumni,
  } = useAlumni();

  const { user, profile, loading: authLoading } = useAuth();

  const isAdmin = user && profile?.role === "admin";

  // Fetch alumni data when component mounts
  useEffect(() => {
    refreshAlumni();
  }, [refreshAlumni]);

  const sortedAlumni = [...alumni].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

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
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight pt-4 text-green-100">
              Celebrating 23 Years of
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-extrabold ">
              Academic Excellence
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-12 text-green-50"
              preserveAspectRatio="none"
              viewBox="0 0 1440 54"
            >
              <path
                fill="currentColor"
                d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
              QHS Alumni Achievers
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-3xl sm:text-3xl  font-light text-green-800 italic">
              We are Proud of You!
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          {isAdmin && (
            <div className="flex justify-center gap-2 sm:gap-4 mb-8">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 sm:px-6 sm:py-3 text-white font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer text-sm sm:text-base"
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
                <span className="hidden sm:inline">Add Alumni</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {sortedAlumni.map((item) => {
              // Parse achievements from description
              const achievements = item.description
                .split(",")
                .map((a) => a.trim())
                .filter((a) => a);

              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-200 shadow-md group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
                >
                  <div className="relative h-80 w-full overflow-hidden flex-shrink-0">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                    <div className="absolute bottom-0 left-4 p-1">
                      <p className="text-base sm:text-md text-white leading-relaxed font-medium">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black p-4 sm:p-6 flex-grow flex flex-col">
                    <div className="border-t border-white/60 pt-3 sm:pt-4 flex-grow">
                      {/* Achievement Text */}
                      {achievements.length > 0 ? (
                        <div className="space-y-2">
                          {achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start">
                              <span className="text-green-300 font-bold text-sm "></span>
                              <p className="text-green-300 font-semibold text-xs sm:text-xs tracking-widest Whitespace-normal">
                                {achievement}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-300 font-semibold text-xs sm:text-xs tracking-wider whitespace-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-white text-blue-500 p-1.5 sm:p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 transform hover:scale-110 cursor-pointer shadow-md"
                        title="Edit alumni"
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
                        onClick={() => deleteAlumni(item.id)}
                        className="bg-white text-red-500 p-1.5 sm:p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-110 cursor-pointer shadow-md"
                        title="Delete alumni"
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
              );
            })}

            {sortedAlumni.length === 0 && (
              <div className="col-span-full text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No alumni records
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new alumni member.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlumniModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={addAlumni}
        loading={loading}
        title="Add Alumni"
        submitText="Add Alumni"
      />

      <AlumniModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAlumni(null);
        }}
        onSubmit={(name, description, imageFile) =>
          editingAlumni
            ? updateAlumni(editingAlumni.id, name, description, imageFile)
            : Promise.resolve(false)
        }
        loading={loading}
        initialData={editingAlumni || undefined}
        title="Edit Alumni"
        submitText="Update Alumni"
      />
    </div>
  );
}
