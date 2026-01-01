"use client";

import Image from "next/image";

const faculty = [
  {
    name: "John Doe",
    role: "Content Marketing",
    quote:
      "Radiant made undercutting all of our competitors an absolute breeze.",
    image: "/images/school.jpg",
  },
  {
    name: "John Doe",
    role: "Content Marketing",
    quote:
      "Radiant made undercutting all of our competitors an absolute breeze.",
    image: "/images/logo.png",
  },
  {
    name: "John Doe",
    role: "Content Marketing",
    quote:
      "Radiant made undercutting all of our competitors an absolute breeze.",
    image: "/images/hero.jpg",
  },
];

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-white">Admin & Faculty</h1>
          <p className="mt-3 text-gray-400">
            Meet our dedicated team of educators and administrators
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faculty.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-md"
            >
              {/* Image */}
              <div className="relative h-120 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-lg text-white leading-relaxed">
                  “{item.quote}”
                </p>

                <div className="mt-6 border-t border-white/20 pt-4">
                  <p className="text-white font-semibold">— {item.name}</p>
                  <p className="text-purple-400 text-sm">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
