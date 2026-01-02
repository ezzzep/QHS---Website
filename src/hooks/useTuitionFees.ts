import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { fetchTuitionFees, updateTuitionFee } from "@/services/tuitionApi";
import { GradeFees, FeeItem } from "@/types/tuition";
import { sortFees } from "@/utils/tuitionUtils";
import { GRADE_ORDER } from "@/constants/feeConstants";
import { useIcons } from "@/hooks/useIcons";

export const useTuitionFees = () => {
  const [tuitionFees, setTuitionFees] = useState<GradeFees[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ fees: FeeItem[] }>({
    fees: [],
  });
  const [saving, setSaving] = useState<boolean>(false);

  const supabase = getBrowserSupabase();
  const { getIconForGrade, getIconForFeeName } = useIcons();

  const fetchFees = async () => {
    try {
      setLoading(true);
      const feesData = await fetchTuitionFees(supabase);

      const groupedData: Record<string, GradeFees> = feesData.reduce(
        (acc, item) => {
          const gradeKey = item.grade;
          if (!acc[gradeKey]) {
            acc[gradeKey] = {
              id: gradeKey,
              grade: gradeKey,
              icon: getIconForGrade(gradeKey),
              fees: [],
              total: 0,
              note: "Extra Curricular Activities NOT Included",
            };
          }

          acc[gradeKey].fees.push({
            id: item.id,
            name: item.fee_name,
            amount: item.amount,
            icon: getIconForFeeName(item.fee_name),
          });

          return acc;
        },
        {} as Record<string, GradeFees>
      );

      Object.values(groupedData).forEach((grade: GradeFees) => {
        grade.fees = sortFees(grade.fees);
        grade.total = grade.fees.reduce(
          (sum: number, fee: FeeItem) => sum + fee.amount,
          0
        );
      });

      const sortedFees: GradeFees[] = Object.values(groupedData).sort(
        (a: GradeFees, b: GradeFees) => {
          return GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade);
        }
      );

      setTuitionFees(sortedFees);
    } catch (err) {
      console.error("Error fetching tuition fees:", err);
      setError("Failed to load tuition fees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const fee = tuitionFees.find((f) => f.id === id);
    if (fee) {
      setEditingId(id);
      setEditValues({
        fees: sortFees([...fee.fees]),
      });
    }
  };

  const handleSave = async (id: string) => {
    try {
      setSaving(true);

      const updatePromises = editValues.fees.map(async (fee: FeeItem) => {
        await updateTuitionFee(supabase, fee.id, fee.amount);
        return fee;
      });

      await Promise.all(updatePromises);

      const updatedFees = tuitionFees.map((fee: GradeFees) => {
        if (fee.id === id) {
          const sortedFees = sortFees(editValues.fees);
          const newTotal = sortedFees.reduce(
            (sum: number, f: FeeItem) =>
              sum + (parseInt(f.amount.toString()) || 0),
            0
          );
          return {
            ...fee,
            fees: sortedFees,
            total: newTotal,
          };
        }
        return fee;
      });

      setTuitionFees(updatedFees);
      setEditingId(null);
      setEditValues({ fees: [] });
    } catch (err) {
      console.error("Error updating tuition fees:", err);
      setError("Failed to update tuition fees. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ fees: [] });
  };

  const handleFeeChange = (feeIndex: number, value: string) => {
    const newFees = [...editValues.fees];
    newFees[feeIndex].amount = parseInt(value) || 0;
    setEditValues({ ...editValues, fees: newFees });
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return {
    tuitionFees,
    loading,
    error,
    editingId,
    editValues,
    saving,
    handleEdit,
    handleSave,
    handleCancel,
    handleFeeChange,
    fetchFees,
  };
};
