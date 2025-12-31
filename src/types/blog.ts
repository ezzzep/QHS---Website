export interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_image_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  author_id: string;
}

export interface Comment {
  id: string;
  content: string;
  blog_id: string;
  user_id: string;
  created_at: string;
  user_name: string;
  user_image: string | null;
}

export interface Profile {
  role: string;
  full_name?: string;
  avatar_url?: string;
}