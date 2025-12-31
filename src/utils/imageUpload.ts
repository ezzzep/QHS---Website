import { getBrowserSupabase } from "@/lib/db";

const supabase = getBrowserSupabase();

export const uploadAuthorImage = async (file: File): Promise<string | null> => {
  const filePath = `author-images/${Date.now()}-${file.name}`;
  try {
    const { error } = await supabase.storage
      .from("author-images")
      .upload(filePath, file);
    if (error) throw error;

    const { data } = supabase.storage
      .from("author-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Error uploading author image:", err);
    return null;
  }
};

export const uploadCoverImage = async (file: File): Promise<string | null> => {
  const filePath = `blog-images/${Date.now()}-${file.name}`;
  try {
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);
    if (error) throw error;

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Error uploading cover image:", err);
    return null;
  }
};
