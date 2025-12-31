import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/db";
import { Blog } from "@/types/blog";
import { uploadAuthorImage, uploadCoverImage } from "@/utils/fileUpload";

const supabase = getBrowserSupabase();

export const useBlog = () => {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthorName, setEditAuthorName] = useState("");
  const [editAuthorImage, setEditAuthorImage] = useState<File | null>(null);
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .single();

        if (error || !data) {
          setError("Blog not found");
        } else {
          setBlog(data);
          setEditTitle(data.title);
          setEditContent(data.content);
          setEditAuthorName(data.author_name || "");
        }
      } catch {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateBlog = async (user: any) => {
    if (!editTitle || !editContent || !user || !blog) return;

    setSavingBlog(true);
    try {
      let authorImageUrl: string | null = blog.author_image_url;
      let coverImageUrl: string | null = blog.cover_image_url;

      if (editAuthorImage) {
        authorImageUrl = await uploadAuthorImage(editAuthorImage);
      }

      if (editCoverImage) {
        coverImageUrl = await uploadCoverImage(editCoverImage);
      }

      const { data, error } = await supabase
        .from("blogs")
        .update({
          title: editTitle,
          content: editContent,
          author_name: editAuthorName,
          author_image_url: authorImageUrl,
          cover_image_url: coverImageUrl,
        })
        .eq("id", blog.id)
        .select()
        .single();

      if (error) {
        console.error("Update blog error:", error);
        alert(`Update failed: ${error.message}`);
        return;
      }

      setBlog(data);
      setIsEditingBlog(false);
      setEditAuthorImage(null);
      setEditCoverImage(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Update error:", err);
      alert(`Update error: ${err.message}`);
    } finally {
      setSavingBlog(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteBlog = async (profile: any) => {
    if (!profile || profile.role !== "admin" || !blog) return;

    if (
      confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      setDeletingBlog(true);
      try {
        const { error: commentsError } = await supabase
          .from("comments")
          .delete()
          .eq("blog_id", blog.id);

        if (commentsError) {
          console.error("Error deleting comments:", commentsError);
        }

        const { error } = await supabase
          .from("blogs")
          .delete()
          .eq("id", blog.id);

        if (error) {
          console.error("Error deleting blog:", error);
          alert("Failed to delete blog");
          return;
        }

        router.push("/");
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete blog");
      } finally {
        setDeletingBlog(false);
      }
    }
  };

  const cancelEditing = () => {
    if (!blog) return;
    setIsEditingBlog(false);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setEditAuthorName(blog.author_name || "");
    setEditAuthorImage(null);
    setEditCoverImage(null);
  };

  return {
    blog,
    loading,
    error,
    isEditingBlog,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editAuthorName,
    setEditAuthorName,
    editAuthorImage,
    setEditAuthorImage,
    editCoverImage,
    setEditCoverImage,
    savingBlog,
    deletingBlog,
    setIsEditingBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    cancelEditing,
  };
};
