import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { fetchSchoolYear, updateSchoolYear } from "@/services/tuitionApi";

export const useSchoolYear = () => {
  const [schoolYear, setSchoolYear] = useState<string>("2025-2026");
  const [tempSchoolYear, setTempSchoolYear] = useState<string>("2025-2026");
  const [editingSchoolYear, setEditingSchoolYear] = useState<boolean>(false);
  const [savingSchoolYear, setSavingSchoolYear] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getBrowserSupabase();

  const fetchYear = async () => {
    try {
      const year = await fetchSchoolYear(supabase);
      setSchoolYear(year);
      setTempSchoolYear(year);
    } catch (err) {
      console.error("Error fetching school year:", err);
    }
  };

  const handleUpdateSchoolYear = async () => {
    try {
      setSavingSchoolYear(true);
      setError(null);

      if (tempSchoolYear && typeof tempSchoolYear === "string") {
        await updateSchoolYear(supabase, tempSchoolYear);
        setSchoolYear(tempSchoolYear);
        setEditingSchoolYear(false);
      }
    } catch (err) {
      console.error("Error updating school year:", err);
      setError("Failed to update school year. Please try again.");
    } finally {
      setSavingSchoolYear(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSchoolYear(false);
    setTempSchoolYear(schoolYear);
  };

  useEffect(() => {
    fetchYear();
  }, []);

  return {
    schoolYear,
    tempSchoolYear,
    editingSchoolYear,
    savingSchoolYear,
    error,
    setTempSchoolYear,
    setEditingSchoolYear,
    handleUpdateSchoolYear,
    handleCancelEdit,
  };
};
