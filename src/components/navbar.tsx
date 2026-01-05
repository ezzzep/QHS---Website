"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/db";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const supabase = getBrowserSupabase();

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

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

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
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === "admin";

  const isSolid = !isHome || scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isSolid ? "bg-white/90 shadow-sm backdrop-blur" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="School Logo"
              width={60}
              height={60}
              priority
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[60px] lg:h-[60px]"
              sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, (max-width: 1024px) 56px, 60px"
            />
          </Link>

          <div
            className={`hidden lg:flex items-center gap-10 text-sm lg:text-base font-medium ${
              isSolid ? "text-slate-700" : "text-white"
            }`}
          >
            <Link href="/" className="hover:text-green-600 cursor-pointer">
              Home
            </Link>
            <Link
              href="/faculty"
              className="hover:text-green-600 cursor-pointer"
            >
              Admin & Faculty
            </Link>
            <Link
              href="/tuition"
              className="hover:text-green-600 cursor-pointer"
            >
              Tuition Fees
            </Link>
            <Link href="/about" className="hover:text-green-600 cursor-pointer">
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-green-600 cursor-pointer"
            >
              Contact
            </Link>
            <Link
              href="/alumni"
              className="hover:text-green-600 cursor-pointer"
            >
              Alumni
            </Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isSolid
                      ? "text-green-600 hover:bg-green-50"
                      : "text-green-300 hover:bg-white/10"
                  }`}
                  title="Account"
                >
                  <User className="w-6 h-6" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {isAdmin ? "Logged in as admin" : "Logged in user"}
                      </p>
                      <p className="text-sm text-gray-700 truncate mt-1">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
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
                } cursor-pointer`}
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isSolid ? "bg-slate-700" : "bg-white"
              } ${
                mobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isSolid ? "bg-slate-700" : "bg-white"
              } ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isSolid ? "bg-slate-700" : "bg-white"
              } ${
                mobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            ></span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white shadow-lg rounded-t-2xl px-6 pt-4 pb-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="flex flex-col gap-3 text-base font-medium text-slate-700">
            <Link
              href="/"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/faculty"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin & Faculty
            </Link>
            <Link
              href="/tuition"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tuition Fees
            </Link>
            <Link
              href="/about"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/alumni"
              className="hover:text-green-600 py-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni
            </Link>
            {user ? (
              <>
                <div className="border-t pt-3 mt-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {isAdmin ? "Logged in as admin" : "Logged in user"}
                  </div>
                  <div className="text-sm text-gray-600 truncate mb-3">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded w-full cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 py-1 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
