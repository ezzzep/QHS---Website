
import type { Metadata } from "next";
import BlogDetail from "./blogDetail";
import { getBrowserSupabase } from "@/lib/db";

const supabase = getBrowserSupabase();

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/* ================================
   ✅ FACEBOOK / OG METADATA
================================ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 🔑 FIX: await params
  const { id } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("id, title, content, cover_image_url")
    .eq("id", id)
    .single();

  if (!blog) {
    return {
      title: "Blog | Queen of Heaven School",
    };
  }

  const description = blog.content.replace(/<[^>]+>/g, "").slice(0, 160);

  const imageUrl = blog.cover_image_url?.startsWith("http")
    ? blog.cover_image_url
    : "https://qhs-website.vercel.app/images/og-default.jpg";

  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      url: `https://qhs-website.vercel.app/blog/${blog.id}`,
      siteName: "Queen of Heaven School",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [imageUrl],
    },
  };
}

/* ================================
   PAGE
================================ */
export default function Page() {
  return <BlogDetail />;
}
