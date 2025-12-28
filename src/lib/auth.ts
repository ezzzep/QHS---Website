import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";

export async function getServerSupabase() {
  const cookieStore = await cookies(); // ✅ await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await getServerSupabase(); // ✅ await
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
