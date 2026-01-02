import { SupabaseClient } from "@supabase/supabase-js";
import { TuitionFee } from "@/types/tuition";

export const fetchTuitionFees = async (
  supabase: SupabaseClient
): Promise<TuitionFee[]> => {
  const { data, error } = await supabase
    .from("tuition_fees")
    .select("*")
    .order("grade", { ascending: true });

  if (error) {
    throw error;
  }

  return data as TuitionFee[];
};

export const updateTuitionFee = async (
  supabase: SupabaseClient,
  id: string,
  amount: number
): Promise<void> => {
  const { error } = await supabase
    .from("tuition_fees")
    .update({ amount })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

export const fetchSchoolYear = async (
  supabase: SupabaseClient
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("tuition_fees")
      .select("school_year")
      .order("school_year", { ascending: false })
      .limit(1);

    if (error) {
      console.log("Error fetching school year, using default");
      return "2025-2026";
    }

    if (data && data.length > 0) {
      const yearValue = data[0].school_year;
      if (yearValue && typeof yearValue === "string") {
        return yearValue;
      }
    }

    return "2025-2026";
  } catch (err) {
    console.error("Error fetching school year:", err);
    return "2025-2026";
  }
};

export const updateSchoolYear = async (
  supabase: SupabaseClient,
  newSchoolYear: string
): Promise<void> => {
  try {
    const { data: allFees, error: fetchError } = await supabase
      .from("tuition_fees")
      .select("id");

    if (fetchError) {
      throw fetchError;
    }

    if (allFees && allFees.length > 0) {
      const updatePromises = allFees.map(async (fee) => {
        const { error } = await supabase
          .from("tuition_fees")
          .update({ school_year: newSchoolYear })
          .eq("id", fee.id);

        if (error) throw error;
        return fee;
      });

      await Promise.all(updatePromises);
    }
  } catch (err) {
    console.error("Error updating school year:", err);
    throw err;
  }
};
