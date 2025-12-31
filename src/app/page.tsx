"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/db";

const supabase = getBrowserSupabase();

interface Profile {
  role: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string; // Added author_name field
  author_image: string | null;
  cover_image_url: string | null;
  created_at: string;
  author_id: string;
}

export default function Home() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showArrow, setShowArrow] = useState(true);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Added saving state

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(""); // Added authorName state
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
          .select("role, full_name")
          .eq("id", user.id)
          .single();
        if (error) console.error("Profile fetch error:", error);
        if (data) {
          setProfile(data);
        }
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
      if (data) {
        setBlogs(data);
        setFilteredBlogs(data);
      }
    };

    fetchBlogs();
  }, []);

  /* ================= SEARCH FUNCTIONALITY ================= */
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

    setIsSaving(true); // Set saving state to true

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

        const { data: publicUrlData } = await supabase.storage
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
          author_name: authorName, // Added author_name to the insert
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
      const newBlogs = [data, ...blogs];
      setBlogs(newBlogs);
      setFilteredBlogs(newBlogs);
      setShowModal(false);
      setTitle("");
      setContent("");
      setAuthorName(""); // Reset author name
      setAuthorImage(null);
      setCoverImage(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload or insert error:", err);
      alert(`Upload or insert error: ${err.message}`);
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  /* ================= HANDLE BLOG CLICK ================= */
  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
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
        <div className="relative z-10 text-center px-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
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
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <h2 className="text-4xl font-bold text-gray-800">
              Insightful Reads
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {profile?.role === "admin" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
                >
                  + Add Blog
                </button>
              )}
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No blogs found matching your search."
                  : "No blogs available yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.id)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[280px]"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {blog.cover_image_url && (
                      <div className="md:w-1/3 h-64 md:h-auto min-h-[280px]">
                        <img
                          src={blog.cover_image_url}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8 md:w-2/3 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-semibold text-gray-800">
                            {blog.title}
                          </h3>
                          {blog.author_image && (
                            <img
                              src={blog.author_image}
                              className="w-12 h-12 rounded-full ml-4"
                            />
                          )}
                        </div>
                        <p className="text-gray-600 line-clamp-4 mb-4 text-base leading-relaxed">
                          {blog.content}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          {blog.author_name && (
                            <p className="text-sm text-gray-600 mb-1">
                              By {blog.author_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {new Date(blog.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium flex items-center cursor-pointer">
                          Read More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl transform transition-all flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-2xl md:text-3xl font-bold text-green-800">
                Add Blog
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-green-700 font-semibold mb-2">
                    Title
                  </label>
                  <input
                    placeholder="Enter blog title"
                    className="w-full border-2 border-green-200 focus:border-green-500 p-3 rounded-lg text-gray-800 placeholder-gray-400 transition-colors outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-2">
                    Author Name
                  </label>
                  <input
                    placeholder="Enter author name"
                    className="w-full border-2 border-green-200 focus:border-green-500 p-3 rounded-lg text-gray-800 placeholder-gray-400 transition-colors outline-none"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-2">
                    Content
                  </label>
                  <textarea
                    placeholder="Write your blog content here. You can write multiple paragraphs..."
                    className="w-full border-2 border-green-200 focus:border-green-500 p-4 rounded-lg text-gray-800 placeholder-gray-400 transition-colors outline-none resize-none min-h-[250px] md:min-h-[300px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                        id="author-image"
                        className="hidden"
                        onChange={(e) =>
                          setAuthorImage(e.target.files?.[0] || null)
                        }
                      />
                      <label
                        htmlFor="author-image"
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
                            {authorImage
                              ? authorImage.name
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
                        id="cover-image"
                        className="hidden"
                        onChange={(e) =>
                          setCoverImage(e.target.files?.[0] || null)
                        }
                      />
                      <label
                        htmlFor="cover-image"
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
                            {coverImage
                              ? coverImage.name
                              : "Choose cover image"}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-green-100 bg-green-50/50">
              <button
                onClick={() => {
                  setShowModal(false);
                  // Reset form fields when canceling
                  setTitle("");
                  setContent("");
                  setAuthorName("");
                  setAuthorImage(null);
                  setCoverImage(null);
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
