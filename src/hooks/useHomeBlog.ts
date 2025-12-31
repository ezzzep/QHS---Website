import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { Blog } from "@/types/blog";
import { uploadAuthorImage, uploadCoverImage } from "@/utils/imageUpload";

const supabase = getBrowserSupabase();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHomeBlogs = (user: any) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Fetch blogs error:", error);
      if (data) {
        setBlogs(data);
        setFilteredBlogs(data);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, blogs]);

  const handleSaveBlog = async () => {
    if (!title || !content || !user) return;

    setIsSaving(true);

    try {
      let authorImageUrl: string | null = null;
      let coverImageUrl: string | null = null;

      if (authorImage) {
        authorImageUrl = await uploadAuthorImage(authorImage);
      }

      if (coverImage) {
        coverImageUrl = await uploadCoverImage(coverImage);
      }

      const { data, error } = await supabase
        .from("blogs")
        .insert({
          title,
          content,
          author_name: authorName,
          author_image_url: authorImageUrl,
          cover_image_url: coverImageUrl,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert blog error:", error);
        alert(`Insert failed: ${error.message}`);
        return;
      }

      const newBlogs = [data, ...blogs];
      setBlogs(newBlogs);
      setFilteredBlogs(newBlogs);
      resetForm();
      setShowModal(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload or insert error:", err);
      alert(`Upload or insert error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthorName("");
    setAuthorImage(null);
    setCoverImage(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowModal(false);
  };

  return {
    blogs,
    filteredBlogs,
    searchQuery,
    setSearchQuery,
    showModal,
    setShowModal,
    isSaving,
    title,
    setTitle,
    content,
    setContent,
    authorName,
    setAuthorName,
    authorImage,
    setAuthorImage,
    coverImage,
    setCoverImage,
    handleSaveBlog,
    handleCancel,
  };
};
