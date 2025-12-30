"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/db";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";

  /* ======================
     Scroll effect (HOME ONLY)
  ====================== */
  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* ======================
     Auth state
  ====================== */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ======================
     Close dropdown on outside click
  ====================== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isSolid = !isHome || scrolled;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSolid ? "bg-white/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="School Logo"
            width={60}
            height={60}
            priority
          />
        </Link>

        {/* Navigation */}
        <div
          className={`flex items-center gap-10 text-sm md:text-base font-medium ${
            isSolid ? "text-slate-700" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-green-600">
            About Us
          </Link>
          <Link href="/faculty" className="hover:text-green-600">
            Admin & Faculty
          </Link>
          <Link href="/alumni" className="hover:text-green-600">
            Alumni
          </Link>
          <Link href="/tuition" className="hover:text-green-600">
            Tuition Fees
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className={`truncate max-w-[180px] ${
                  isSolid
                    ? "text-green-600 hover:text-green-700"
                    : "text-green-300 hover:text-green-200"
                }`}
                title={user.email ?? ""}
              >
                {user.email}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`${
                isSolid
                  ? "text-green-600 hover:text-green-700"
                  : "text-green-300 hover:text-green-200"
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
