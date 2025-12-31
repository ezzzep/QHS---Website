"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { getBrowserSupabase } from "@/lib/db";
import Head from "next/head";

const supabase = getBrowserSupabase();
interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_image_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  author_id: string;
}

interface Comment {
  id: string;
  content: string;
  blog_id: string;
  user_id: string;
  created_at: string;
  user_name: string;
  user_image: string | null;
}

interface Profile {
  role: string;
}

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit blog state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthorName, setEditAuthorName] = useState("");
  const [editAuthorImage, setEditAuthorImage] = useState<File | null>(null);
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(false);

  // Update document head when blog data is loaded
  useEffect(() => {
    if (blog) {
      // Create a description from the blog content (first 150 characters)
      const description =
        blog.content.length > 150
          ? blog.content.substring(0, 150) + "..."
          : blog.content;

      // Update page title
      document.title = blog.title;

      // Update or create meta tags
      const updateMetaTag = (property: string, content: string) => {
        let tag =
          document.querySelector(`meta[property="${property}"]`) ||
          document.querySelector(`meta[name="${property}"]`);

        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute(
            property.includes(":") ? "property" : "name",
            property
          );
          document.head.appendChild(tag);
        }

        tag.setAttribute("content", content);
      };

      // Update Open Graph tags
      updateMetaTag("og:title", blog.title);
      updateMetaTag("og:description", description);
      updateMetaTag("og:type", "article");
      updateMetaTag("og:url", window.location.href);
      updateMetaTag("og:site_name", "Queen of Heaven School");

      // Update image if available
      if (blog.cover_image_url) {
        updateMetaTag("og:image", blog.cover_image_url);
        updateMetaTag("og:image:width", "1200");
        updateMetaTag("og:image:height", "630");
        updateMetaTag("og:image:alt", blog.title);
      }

      // Update Twitter Card tags
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", blog.title);
      updateMetaTag("twitter:description", description);

      if (blog.cover_image_url) {
        updateMetaTag("twitter:image", blog.cover_image_url);
      }

      // Update description meta tag
      updateMetaTag("description", description);
    }
  }, [blog]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (error) console.error("Profile fetch error:", error);
          if (data) setProfile(data);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch blog details and comments
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
          // Initialize edit state with current blog data
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

    const fetchComments = async () => {
      try {
        // Fetch comments without user info first
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("blog_id", blogId)
          .order("created_at", { ascending: false });

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
          setComments([]);
          return;
        }

        if (!commentsData || commentsData.length === 0) {
          setComments([]);
          return;
        }

        // If user is not logged in, show all comments as anonymous
        if (!user) {
          const anonymousComments = commentsData.map((comment) => ({
            id: comment.id,
            content: comment.content,
            blog_id: comment.blog_id,
            user_id: comment.user_id,
            created_at: comment.created_at,
            user_name: "Anonymous",
            user_image: null,
          }));
          setComments(anonymousComments);
          return;
        }

        // If user is logged in, fetch actual user profiles
        const userIds = [
          ...new Set(commentsData.map((comment) => comment.user_id)),
        ];

        if (userIds.length === 0) {
          setComments([]);
          return;
        }

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // If profiles fail, show as "User"
          const transformedComments = commentsData.map((comment) => ({
            id: comment.id,
            content: comment.content,
            blog_id: comment.blog_id,
            user_id: comment.user_id,
            created_at: comment.created_at,
            user_name: "User",
            user_image: null,
          }));
          setComments(transformedComments);
          return;
        }

        // Create a map of user profiles
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach((profile) => {
            profilesMap.set(profile.id, profile);
          });
        }

        // Transform the data with actual user names
        const transformedComments = commentsData.map((comment) => {
          const profile = profilesMap.get(comment.user_id);
          return {
            id: comment.id,
            content: comment.content,
            blog_id: comment.blog_id,
            user_id: comment.user_id,
            created_at: comment.created_at,
            user_name: profile?.full_name || "User",
            user_image: profile?.avatar_url || null,
          };
        });

        setComments(transformedComments);
      } catch (err) {
        console.error("Unexpected error fetching comments:", err);
        setComments([]);
      }
    };

    fetchBlog();
    fetchComments();
  }, [blogId, user]);

  // Handle blog update
  const handleUpdateBlog = async () => {
    if (!editTitle || !editContent || !user || !blog) return;

    setSavingBlog(true);
    try {
      let authorImageUrl: string | null = blog.author_image_url;
      let coverImageUrl: string | null = blog.cover_image_url;

      // Upload author image if changed
      if (editAuthorImage) {
        const filePath = `author-images/${Date.now()}-${editAuthorImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("author-images")
          .upload(filePath, editAuthorImage);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("author-images")
          .getPublicUrl(filePath);
        authorImageUrl = publicUrlData.publicUrl;
      }

      // Upload cover image if changed
      if (editCoverImage) {
        const filePath = `blog-images/${Date.now()}-${editCoverImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, editCoverImage);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);
        coverImageUrl = publicUrlData.publicUrl;
      }

      // Update blog
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

      // Update local state
      setBlog(data);
      setIsEditingBlog(false);
      setEditAuthorImage(null);
      setEditCoverImage(null);
    } catch (err: any) {
      console.error("Update error:", err);
      alert(`Update error: ${err.message}`);
    } finally {
      setSavingBlog(false);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    if (!user || profile?.role !== "admin" || !blog) return;

    if (
      confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      setDeletingBlog(true);
      try {
        // Delete all comments associated with this blog first
        const { error: commentsError } = await supabase
          .from("comments")
          .delete()
          .eq("blog_id", blog.id);

        if (commentsError) {
          console.error("Error deleting comments:", commentsError);
        }

        // Delete the blog
        const { error } = await supabase
          .from("blogs")
          .delete()
          .eq("id", blog.id);

        if (error) {
          console.error("Error deleting blog:", error);
          alert("Failed to delete blog");
          return;
        }

        // Redirect to home page
        router.push("/");
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete blog");
      } finally {
        setDeletingBlog(false);
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (
    commentId: string,
    commentUserId: string
  ) => {
    // Check if user can delete this comment (either admin or comment owner)
    const canDelete =
      profile?.role === "admin" || (user && user.id === commentUserId);

    if (!canDelete) {
      alert("You don't have permission to delete this comment");
      return;
    }

    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        const { error } = await supabase
          .from("comments")
          .delete()
          .eq("id", commentId);

        if (error) {
          console.error("Error deleting comment:", error);
          alert("Failed to delete comment: " + error.message);
          return;
        }

        // Update local state
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete comment");
      }
    }
  };

  // Handle Facebook sharing
  const handleShareToFacebook = () => {
    if (!blog) return;

    // Get the current URL
    const url = window.location.href;

    // Create Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;

    // Open Facebook share in a new tab
    window.open(facebookShareUrl, "_blank");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmittingComment(true);
    try {
      // Insert comment
      const { data, error } = await supabase
        .from("comments")
        .insert({
          content: newComment.trim(),
          blog_id: blogId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment");
        return;
      }

      // Get user profile for the new comment
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      // Add the new comment to local state
      const newCommentObj: Comment = {
        id: data.id,
        content: newComment.trim(),
        blog_id: blogId,
        user_id: user.id,
        created_at: data.created_at,
        user_name:
          userProfile?.full_name || user.email?.split("@")[0] || "User",
        user_image: userProfile?.avatar_url || null,
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-8 ">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4"></div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {isEditingBlog ? (
          // Edit Blog Form
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-green-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border-2 border-green-200 focus:border-green-500 p-3 rounded-lg text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-green-700 font-semibold mb-2">
                  Author Name
                </label>
                <input
                  value={editAuthorName}
                  onChange={(e) => setEditAuthorName(e.target.value)}
                  className="w-full border-2 border-green-200 focus:border-green-500 p-3 rounded-lg text-gray-800 outline-none"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-green-700 font-semibold mb-2">
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full border-2 border-green-200 focus:border-green-500 p-3 rounded-lg text-gray-800 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-700 font-semibold mb-2">
                    Author Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="edit-author-image"
                      className="hidden"
                      onChange={(e) =>
                        setEditAuthorImage(e.target.files?.[0] || null)
                      }
                    />
                    <label
                      htmlFor="edit-author-image"
                      className="flex items-center justify-center w-full border-2 border-dashed border-green-300 rounded-lg p-3 cursor-pointer hover:bg-green-50 transition-colors"
                    >
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mx-auto text-green-500 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-green-700 text-sm font-medium truncate">
                          {editAuthorImage
                            ? editAuthorImage.name
                            : blog.author_image_url
                            ? "Change author image"
                            : "Choose author image"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-2">
                    Cover Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="edit-cover-image"
                      className="hidden"
                      onChange={(e) =>
                        setEditCoverImage(e.target.files?.[0] || null)
                      }
                    />
                    <label
                      htmlFor="edit-cover-image"
                      className="flex items-center justify-center w-full border-2 border-dashed border-green-300 rounded-lg p-3 cursor-pointer hover:bg-green-50 transition-colors"
                    >
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mx-auto text-green-500 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-green-700 text-sm font-medium truncate">
                          {editCoverImage
                            ? editCoverImage.name
                            : blog.cover_image_url
                            ? "Change cover image"
                            : "Choose cover image"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditingBlog(false);
                    setEditTitle(blog.title);
                    setEditContent(blog.content);
                    setEditAuthorName(blog.author_name || "");
                    setEditAuthorImage(null);
                    setEditCoverImage(null);
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBlog}
                  disabled={savingBlog}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {savingBlog ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Normal Blog View
          <>
            {blog.cover_image_url && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="w-full h-140 md:h-140 object-cover"
                />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl md:text-4xl font-bold text-gray-900">
                  {blog.title}
                </h1>
                <div className="flex gap-2">
                  {/* Facebook Share Button */}
                  <button
                    onClick={handleShareToFacebook}
                    className="bg-white border-2 border-blue-600 text-blue-600 p-2 rounded-lg transition-colors cursor-pointer hover:bg-blue-600 hover:text-white"
                    title="Share on Facebook"
                  >
                    <Share2 size={20} />
                  </button>

                  {profile?.role === "admin" && (
                    <>
                      <button
                        onClick={() => setIsEditingBlog(true)}
                        className="bg-white border-2 border-blue-500 text-blue-500 p-2 rounded-lg transition-colors cursor-pointer hover:bg-blue-500 hover:text-white"
                        title="Edit blog"
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
                      <button
                        onClick={handleDeleteBlog}
                        disabled={deletingBlog}
                        className="bg-white border-2 border-red-500 text-red-500 p-2 rounded-lg transition-colors cursor-pointer hover:bg-red-500 hover:text-white disabled:border-red-300 disabled:text-red-300"
                        title="Delete blog"
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
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center">
                  {blog.author_image_url && (
                    <img
                      src={blog.author_image_url}
                      alt="Author"
                      className="w-24 h-24 rounded-full mr-3 object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Published by</p>
                    <p className="text-gray-800 font-medium">
                      {blog.author_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                {blog.content.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-gray-700 leading-relaxed text-md tracking-wide"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 text-gray-900 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">
                You need to be logged in to post a comment.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {comment.user_image ? (
                      <img
                        src={comment.user_image}
                        alt={comment.user_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                        {comment.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">
                          {comment.user_name}
                        </h4>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {/* Show delete button if user is admin or comment owner */}
                      {(profile?.role === "admin" ||
                        (user && user.id === comment.user_id)) && (
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.id, comment.user_id)
                          }
                          className="bg-white border-2 border-red-500 text-red-500 p-1 rounded transition-colors cursor-pointer hover:bg-red-500 hover:text-white"
                          title={
                            user && user.id === comment.user_id
                              ? "Delete your comment"
                              : "Delete comment"
                          }
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
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}
