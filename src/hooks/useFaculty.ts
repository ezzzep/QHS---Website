import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { Faculty } from "@/types/faculty";

const supabase = getBrowserSupabase();

export const useFaculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Faculty | null>(null);
  const [dragOverItem, setDragOverItem] = useState<Faculty | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadFaculty = async () => {
      const { data } = await supabase
        .from("faculty")
        .select("*")
        .order("order_index", { ascending: true });

      if (mounted && data) setFaculty(data);
    };

    loadFaculty();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshFaculty = async () => {
    const { data } = await supabase
      .from("faculty")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) setFaculty(data);
  };

  const uploadImage = async (file: File): Promise<string> => {
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

  const addFaculty = async (
    name: string,
    position: string,
    imageFile: File | null
  ): Promise<boolean> => {
    if (!name || !position) {
      alert("Please fill all required fields");
      return false;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const maxOrderIndex =
        faculty.length > 0 ? Math.max(...faculty.map((f) => f.order_index)) : 0;

      const { error } = await supabase.from("faculty").insert({
        name,
        position,
        image_url: imageUrl,
        order_index: maxOrderIndex + 1,
      });

      if (error) throw error;

      setShowModal(false);
      refreshFaculty();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFaculty = async (
    id: string,
    name: string,
    position: string,
    imageFile: File | null
  ): Promise<boolean> => {
    if (!name || !position) {
      alert("Please fill all required fields");
      return false;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = editingFaculty?.image_url || null;

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
        .eq("id", id);

      if (error) throw error;

      setEditingFaculty(null);
      setShowEditModal(false);
      refreshFaculty();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setShowEditModal(true);
  };

  const deleteFaculty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    try {
      const { data: facultyMember } = await supabase
        .from("faculty")
        .select("image_url")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("faculty").delete().eq("id", id);

      if (error) throw error;

      if (facultyMember?.image_url) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDragStart = (e: React.DragEvent, faculty: Faculty) => {
    setDraggedItem(faculty);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, faculty: Faculty) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(faculty);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, dropTarget: Faculty) => {
    e.preventDefault();
    setDragOverItem(null);

    if (!draggedItem || draggedItem.id === dropTarget.id) return;

    try {
      const draggedIndex = faculty.findIndex((f) => f.id === draggedItem.id);
      const dropIndex = faculty.findIndex((f) => f.id === dropTarget.id);

      const newFaculty = [...faculty];
      newFaculty.splice(draggedIndex, 1);
      newFaculty.splice(dropIndex, 0, draggedItem);

      const updatedFaculty = newFaculty.map((faculty, index) => ({
        ...faculty,
        order_index: index,
      }));

      setFaculty(updatedFaculty);

      const updates = updatedFaculty.map((f) =>
        supabase
          .from("faculty")
          .update({ order_index: f.order_index })
          .eq("id", f.id)
      );

      await Promise.all(updates);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error reordering faculty:", err);
      alert("Failed to reorder faculty. Please try again.");
      refreshFaculty();
    } finally {
      setDraggedItem(null);
    }
  };

  return {
    faculty,
    loading,
    showModal,
    showEditModal,
    editingFaculty,
    reorderMode,
    dragOverItem,
    refreshFaculty,
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
  };
};
