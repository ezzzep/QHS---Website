"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Trophy,
  BookOpen,
  Target,
  Eye,
  Zap,
  Handshake,
  Shield,
  Crown,
} from "lucide-react";

export default function AboutPage() {
  const [activeImage, setActiveImage] = useState(null);

  const images = [
    {
      src: "/images/abou3.jpg",
      size: "large",
    },
    {
      src: "/images/about2.jpg",
      size: "medium",
    },
    {
      src: "/images/about4.jpg",
      size: "small",
    },
    {
      src: "/images/about1.png",
      size: "medium",
    },
  ];

  const coreValues = [
    {
      name: "Cooperation",
      description:
        "In every organization, working together is very necessary. Everyone in the organization must share, be unified, and must support each other to achieve goal.",
      icon: Handshake,
    },
    {
      name: "Honesty",
      description:
        "Transparency in an organization in all aspects creates trust. It means an open presentation and periodic reporting to the parents about the school performance and accountabilities.",
      icon: Shield,
    },
    {
      name: "Leadership",
      description:
        "Leadership is the ability and readiness to inspire, guide, or manage others. It is an activity of influencing people to bond together for a common purpose and endeavor by the inspiration and guidance of a leader determined to achieve that purpose.",
      icon: Crown,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center pt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Nothing great in this world is <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                accomplished without passion.
              </span>
            </h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-12 text-white"
              preserveAspectRatio="none"
              viewBox="0 0 1440 54"
            >
              <path
                fill="currentColor"
                d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            Founded as a pre-school, we earned government recognition in 2008
            and expanded to grade school in 2012. Today, we continue to pursue
            excellence and deliver quality education to our students.
          </p>
        </div>

        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
              <div
                className={`relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden cursor-pointer group ${
                  activeImage === 0 ? "ring-4 ring-green-600" : ""
                }`}
              >
                <Image
                  src={images[0].src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 rounded-3xl "
                />
              </div>
            </div>

            <div className="col-span-1">
              <div
                className={`relative h-[300px] sm:h-[290px] overflow-hidden cursor-pointer group ${
                  activeImage === 1 ? "ring-4 ring-green-600" : ""
                }`}
              >
                <Image
                  src={images[1].src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 rounded-3xl "
                />
              </div>
            </div>

            <div className="col-span-1">
              <div
                className={`relative h-[300px] sm:h-[290px] overflow-hidden cursor-pointer group ${
                  activeImage === 2 ? "ring-4 ring-green-600" : ""
                }`}
              >
                <Image
                  src={images[2].src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 rounded-3xl "
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <div
                className={`relative h-[300px] sm:h-[290px] overflow-hidden cursor-pointer group ${
                  activeImage === 3 ? "ring-4 ring-green-600" : ""
                }`}
              >
                <Image
                  src={images[3].src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 rounded-3xl "
                />
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-40 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 md:gap-0">
            <div className="relative w-full flex items-center justify-center order-2 md:order-1 mt-8 md:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl w-70  max-w-md mx-auto">
                <Image
                  src="/images/dra-mn.jpeg"
                  alt="Founder"
                  width={400}
                  height={500}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <span className="block text-4xl sm:text-5xl md:text-6xl text-gray-300 leading-none">
                “
              </span>
              <p className="text-base sm:text-lg text-gray-700 mt-4">
                After teaching for many years in the Public school, my
                dedication to teaching has grown stronger, which also gave me
                enough courage and motivation to start my own school. In 2002,
                this wonderful vision finally materialized, and Queen of Heaven
                School was born.
              </p>
              <br />
              <p className="text-base sm:text-lg text-gray-700 pb-12">
                From my father&apos;s old construction office, we transformed
                the space into classrooms—a journey that allowed me not only to
                do what I love but also to continue my mother&apos;s legacy.
              </p>
              <span className="block text-4xl sm:text-5xl md:text-6xl text-gray-300 leading-none text-right -mt-8">
                ”
              </span>
              <div className="mt-2">
                <p className="font-extrabold text-green-800 text-lg">
                  Dr. Melinda T. Manlangit
                </p>
                <p className="text-gray-500 font-bold">Directress</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-16 sm:mb-20 lg:mb-22 mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-6 sm:p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  23 Years of Educational Excellence
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                  For more than two decades, Queen of Heaven School has been
                  shaping young minds and building futures. Our commitment to
                  quality education has made us a trusted institution in Cavite.
                </p>
              </div>
              <div className="relative bg-green-50 p-6 sm:p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    Excellence Award
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Recognized for outstanding educational service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 sm:mb-20 lg:mb-22">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Academic Achievements
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Our commitment to excellence is reflected in our students&apos;
              outstanding performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">
                NAT Overall First Place
              </h3>
              <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
                Achieved the top position in the National Achievement Test
              </p>
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  2013 - 2014
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">
                DepED Compliance
              </h3>
              <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
                Fully compliant with Department of Education standards
              </p>
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Ongoing
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">
                Outstanding Performance
              </h3>
              <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
                Consistently producing high-achieving students
              </p>
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Continuous
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-22">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-green-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Queen of Heaven School is a child-friendly school, developing and
              providing God-fearing, value-laden, environment-friendly,
              productive individuals who will become responsible citizens of the
              community and country.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-green-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To provide quality and relevant basic education for the
              learners&apos; complete intellectual, social, emotional, moral,
              spiritual knowledge and environmental awareness through competent
              teachers, administrators, and supportive parents.
            </p>
          </div>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 sm:p-8 border border-green-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    {value.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
