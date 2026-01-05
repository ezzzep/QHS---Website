"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Queen of Heaven School"
                width={44}
                height={44}
              />
              <span className="text-xl font-semibold text-gray-900">
                Queen of Heaven School
                <br />
                of Cavite, INC.
              </span>
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed max-w-sm  italic">
              Brgy. Queen&apos;s Row East Lowland,
              <br />
              Bacoor, Cavite, Philippines 4102
            </p>

            <div className="flex gap-5 pt-2 text-teal-600">
              <a
                href="https://www.facebook.com/profile.php?id=100069498575852"
                aria-label="Facebook"
                className="hover:text-teal-700 transition"
              >
                <Facebook width={22} height={22} />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=queenofheavenschool@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="hover:text-teal-700 transition"
              >
                <Mail width={22} height={22} />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <ul className="space-y-4 text-gray-900 font-bold">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/faculty">Admin & Faculty</Link>
              </li>
              <li>
                <Link href="/tuition">Tuition Fees</Link>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <ul className="space-y-4 text-gray-900 font-bold">
              <li>
                <Link href="/about">About Us</Link>
              </li>

              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/alumni">Alumni</Link>
              </li>
            </ul>

            <p className="mt-8 text-xs text-gray-500">
              © {year} Queen of Heaven School of Cavite, INC. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
