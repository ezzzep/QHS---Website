import { getBrowserSupabase } from "@/lib/db";

const supabase = getBrowserSupabase();

export const uploadAuthorImage = async (file: File): Promise<string> => {
  const filePath = `author-images/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("author-images")
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("author-images")
    .getPublicUrl(filePath);
  return publicUrlData.publicUrl;
};

export const uploadCoverImage = async (file: File): Promise<string> => {
  const filePath = `blog-images/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath);
  return publicUrlData.publicUrl;
};
