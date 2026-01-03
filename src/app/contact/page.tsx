"use client";

import emailjs from "@emailjs/browser";
import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});


  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!user?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: user?.email || "",
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      );

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      }, 3000);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const isDisabled = loading || !user;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
              We&apos;re here to help and answer any questions you might have.
              We look forward to hearing from you.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 text-white"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group relative bg-white rounded-2xl shadow-lg p-8 border border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                Brgy. Queen&apos;s Row East Lowland
                <br /> Bacoor, Philippines, 4102
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg p-8 border border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">
                0942 902 9029
                <br />
                0917 180 8677
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg p-8 border border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">queenofheavenschool@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h2>

            {!loading && !user && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-800">
                      Login Required
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">
                      Please log in to send us a message. This helps us prevent
                      spam and ensures that inquiries come from genuine parents
                      or guardians.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => router.push("/login")}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-green-700">
                  Thank you for contacting us. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isDisabled || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-300${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } ${
                        isDisabled || isSubmitting
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      onChange={() => {}}
                      disabled={true}
                      className={`w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-300${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isDisabled || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder:text-gray-300${
                      isDisabled || isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isDisabled || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border text-black cursor-pointer ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } ${
                      isDisabled || isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="FOR INQUIRY">For Inquiry</option>
                    <option value="FOR ADMISSION">For Admission</option>
                    <option value="WALK-IN SCHEDULE">Walk-In Schedule</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isDisabled || isSubmitting}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-300 ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } ${
                      isDisabled || isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isDisabled || isSubmitting}
                  className={`w-full font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group ${
                    isDisabled || isSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-18"> </h2>
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/school.jpg"
                alt="Queen of Heaven School Building"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6 bg-green-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Active Hours
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 7:00 AM - 5:00 PM</p>
                <p>Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
