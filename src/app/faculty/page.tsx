"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getBrowserSupabase } from "@/lib/db";

const supabase = getBrowserSupabase();

interface Faculty {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  /* ===============================
     Initial fetch
  =============================== */
  useEffect(() => {
    let mounted = true;

    const loadFaculty = async () => {
      const { data } = await supabase
        .from("faculty")
        .select("*")
        .order("created_at", { ascending: false });

      if (mounted && data) setFaculty(data);
    };

    loadFaculty();
    return () => {
      mounted = false;
    };
  }, []);

  /* ===============================
     Refresh faculty
  =============================== */
  const refreshFaculty = async () => {
    const { data } = await supabase
      .from("faculty")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setFaculty(data);
  };

  /* ===============================
     Upload image to Supabase Storage
  =============================== */
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("faculty-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("faculty-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* ===============================
     Insert faculty
  =============================== */
  const addFaculty = async () => {
    if (!name || !position) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("faculty").insert({
        name,
        position,
        image_url: imageUrl,
      });

      if (error) throw error;

      // Reset form
      setName("");
      setPosition("");
      setImageFile(null);
      setShowModal(false);

      refreshFaculty();
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  /* ===============================
     Update faculty
  =============================== */
  const updateFaculty = async () => {
    if (!name || !position || !editingFaculty) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = editingFaculty.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("faculty")
        .update({
          name,
          position,
          image_url: imageUrl,
        })
        .eq("id", editingFaculty.id);

      if (error) throw error;

      // Reset form
      setName("");
      setPosition("");
      setImageFile(null);
      setEditingFaculty(null);
      setShowEditModal(false);

      refreshFaculty();
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  /* ===============================
     Open edit modal
  =============================== */
  const openEditModal = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setName(faculty.name);
    setPosition(faculty.position);
    setImageFile(null);
    setShowEditModal(true);
  };

  /* ===============================
     Delete faculty
  =============================== */
  const deleteFaculty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    try {
      // Get the faculty member to check if they have an image
      const { data: facultyMember } = await supabase
        .from("faculty")
        .select("image_url")
        .eq("id", id)
        .single();

      // Delete the faculty member
      const { error } = await supabase.from("faculty").delete().eq("id", id);

      if (error) throw error;

      // If the faculty member had an image, delete it from storage
      if (facultyMember?.image_url) {
        // Extract the file path from the URL
        const urlParts = facultyMember.image_url.split("/");
        const filePath = urlParts[urlParts.length - 1];

        const { error: storageError } = await supabase.storage
          .from("faculty-images")
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting image:", storageError);
        }
      }

      refreshFaculty();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Admin & Faculty</h1>
          <p className="mt-3 text-gray-500">
            Meet our dedicated team of educators and administrators
          </p>
        </div>

        {/* Add Faculty Button */}
        <div className="mb-12 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Faculty
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faculty.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-md group"
            >
              <div className="relative h-96 w-full">
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

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-lg text-white leading-relaxed">
                  {item.name}
                </p>

                <div className="mt-6 border-t  border-white/60 pt-4">
                  <p className="text-white font-semibold">{item.position}</p>
                </div>
              </div>

              {/* Action buttons - only visible on hover */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Edit button */}
                <button
                  onClick={() => openEditModal(item)}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit faculty member"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteFaculty(item.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Delete faculty member"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
            </div>
          ))}

          {faculty.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              No faculty members found.
            </p>
          )}
        </div>
      </div>

      {/* ===============================
          Add Faculty Modal
      =============================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg mx-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Add Faculty
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setName("");
                    setPosition("");
                    setImageFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addFaculty}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? "Adding..." : "Add Faculty"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================
          Edit Faculty Modal
      =============================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg mx-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Edit Faculty
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep the current image
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFaculty(null);
                    setName("");
                    setPosition("");
                    setImageFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateFaculty}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? "Updating..." : "Update Faculty"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
