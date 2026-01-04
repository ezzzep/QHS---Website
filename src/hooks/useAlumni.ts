import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/db";

// Define the Alumni type
export interface Alumni {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const supabase = getBrowserSupabase();

export const useAlumni = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAlumni = async () => {
      const { data } = await supabase
        .from("almuni") // Using "almuni" as in your table name
        .select("*")
        .order("created_at", { ascending: false }); // Order by creation date, newest first

      if (mounted && data) setAlumni(data);
    };

    loadAlumni();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshAlumni = async () => {
    const { data } = await supabase
      .from("almuni") // Using "almuni" as in your table name
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAlumni(data);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("alumni-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("alumni-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addAlumni = async (
    name: string,
    description: string,
    imageFile: File | null
  ): Promise<boolean> => {
    if (!name || !description || !imageFile) {
      alert("Please fill all required fields");
      return false;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("almuni").insert({
        name,
        description,
        image_url: imageUrl,
      });

      if (error) throw error;

      setShowModal(false);
      refreshAlumni();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAlumni = async (
    id: string,
    name: string,
    description: string,
    imageFile: File | null
  ): Promise<boolean> => {
    if (!name || !description) {
      alert("Please fill all required fields");
      return false;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = editingAlumni?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("almuni")
        .update({
          name,
          description,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingAlumni(null);
      setShowEditModal(false);
      refreshAlumni();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (alumni: Alumni) => {
    setEditingAlumni(alumni);
    setShowEditModal(true);
  };

  const deleteAlumni = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni record?")) {
      return;
    }

    try {
      // Get the image URL before deleting the record
      const { data: alumniMember } = await supabase
        .from("almuni")
        .select("image_url")
        .eq("id", id)
        .single();

      // Delete the record
      const { error } = await supabase.from("almuni").delete().eq("id", id);

      if (error) throw error;

      // Delete the image from storage if it exists
      if (alumniMember?.image_url) {
        const urlParts = alumniMember.image_url.split("/");
        const filePath = urlParts[urlParts.length - 1];

        const { error: storageError } = await supabase.storage
          .from("alumni-images")
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting image:", storageError);
        }
      }

      refreshAlumni();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
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
  };
};
