"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/db";

interface Profile {
  role: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author_image: string | null;
  cover_image_url: string | null;
}

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showArrow, setShowArrow] = useState(true);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  /* ================= SCROLL ARROW ================= */
  useEffect(() => {
    const onScroll = () => setShowArrow(window.scrollY < 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= AUTH + PROFILE ================= */
  useEffect(() => {
    const loadUser = async () => {
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
    };
    loadUser();
  }, []);

  /* ================= FETCH BLOGS ================= */
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Fetch blogs error:", error);
      if (data) setBlogs(data);
    };

    fetchBlogs();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file: File, bucket: string) => {
    const filePath = `${Date.now()}-${file.name}`;
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error(`Error uploading to ${bucket}:`, err);
      return null;
    }
  };

  /* ================= SAVE BLOG ================= */
  const handleSaveBlog = async () => {
    if (!title || !content || !user) return;

    try {
      let authorImageUrl: string | null = null;
      let coverImageUrl: string | null = null;

      // Upload author image
      if (authorImage) {
        const filePath = `author-images/${Date.now()}-${authorImage.name}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("author-images")
          .upload(filePath, authorImage);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("author-images")
          .getPublicUrl(filePath);
        authorImageUrl = publicUrlData.publicUrl;
      }

      // Upload cover image
      if (coverImage) {
        const filePath = `blog-images/${Date.now()}-${coverImage.name}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("blog-images")
          .upload(filePath, coverImage);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);
        coverImageUrl = publicUrlData.publicUrl;
      }

      // Insert blog
      const { data, error } = await supabase
        .from("blogs")
        .insert({
          title,
          content,
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

      // Update local state
      setBlogs((prev) => [data, ...prev]);
      setShowModal(false);
      setTitle("");
      setContent("");
      setAuthorImage(null);
      setCoverImage(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload or insert error:", err);
      alert(`Upload or insert error: ${err.message}`);
    }
  };

  return (
    <main className="font-sans bg-white">

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Homepage cover"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="animate-fade-in-down text-5xl md:text-7xl lg:text-8xl font-extrabold text-white">
            Queen of Heaven
          </h1>
          <span className="block text-green-300 text-5xl md:text-7xl lg:text-7xl font-extrabold">
            School of Cavite, INC.
          </span>
          <p className="animate-fade-in-up mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Nurturing minds, building character, and inspiring excellence since
            1995.
          </p>
          <div className="animate-fade-in-up mt-10">
            <a
              href="#features"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Discover More
            </a>
          </div>
        </div>
        {showArrow && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-300">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </section>

      {/* BLOG SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {profile?.role === "admin" && (
            <div className="flex justify-between mb-8">
              <h2 className="text-4xl font-bold">School Blog</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 px-6 py-3 rounded-full font-bold"
              >
                + Add Blog
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {blog.cover_image_url && (
                  <img
                    src={blog.cover_image_url}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 line-clamp-4">{blog.content}</p>
                  {blog.author_image && (
                    <img
                      src={blog.author_image}
                      className="w-10 h-10 rounded-full mt-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Add Blog</h3>

            <input
              placeholder="Title"
              className="w-full border p-2 mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Content"
              className="w-full border p-2 mb-3"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <label className="block mb-2 font-semibold">Author Image:</label>
            <input
              type="file"
              onChange={(e) => setAuthorImage(e.target.files?.[0] || null)}
            />

            <label className="block mt-3 mb-2 font-semibold">
              Cover Image:
            </label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
