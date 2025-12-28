"use client";

import { useState } from "react";
import { supabase } from "@/lib/db";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-semibold text-center">Login</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {sent ? (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            Check your email for the login link ✉️
          </p>
        ) : (
          <>
            <div className="mb-6">
              <label className="mb-1 block text-sm">Email</label>
              <input
                type="email"
                className="w-full rounded border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send login link"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
