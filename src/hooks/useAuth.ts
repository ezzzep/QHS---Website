import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/db";
import { Profile } from "@/types/blog";

const supabase = getBrowserSupabase();

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
            .select("role, full_name, avatar_url")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Profile fetch error:", error);
            setProfile({ role: "user" });
          } else if (data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error("Unexpected auth error:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, profile, loading };
};
