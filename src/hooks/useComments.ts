import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { Comment } from "@/types/blog";

const supabase = getBrowserSupabase();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useComments = (blogId: string, user: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    const fetchComments = async () => {
      try {

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("blog_id", blogId)
          .order("created_at", { ascending: false });

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
          setComments([]);
          setLoading(false);
          return;
        }

        if (!commentsData || commentsData.length === 0) {
          setComments([]);
          setLoading(false);
          return;
        }

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
          setLoading(false);
          return;
        }

        const userIds = [
          ...new Set(commentsData.map((comment) => comment.user_id)),
        ];

        if (userIds.length === 0) {
          setComments([]);
          setLoading(false);
          return;
        }

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
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
          setLoading(false);
          return;
        }

        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach((profile) => {
            profilesMap.set(profile.id, profile);
          });
        }

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
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId, user]);

  const handleCommentSubmit = async (
    newComment: string,
    setNewComment: (value: string) => void,
    setSubmittingComment: (value: boolean) => void
  ) => {
    if (!newComment.trim() || !user) return;

    setSubmittingComment(true);
    try {
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

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

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

  const handleDeleteComment = async (
    commentId: string,
    commentUserId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any
  ) => {

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

        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete comment");
      }
    }
  };

  return {
    comments,
    loading,
    handleCommentSubmit,
    handleDeleteComment,
  };
};
