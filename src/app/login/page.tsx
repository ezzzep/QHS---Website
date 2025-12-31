"use client";

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/db";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import Image from "next/image";

const supabase = getBrowserSupabase();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep("otp");
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setError("Invalid or expired code");
      return;
    }

    window.location.href = "/";
  };

  const goBack = () => {
    setStep("email");
    setOtp("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {step === "email" ? (
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Enter your email to receive a verification code
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-center rounded-lg bg-red-50 p-4 border border-red-100">
                  <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading || !email}
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-8">
                <div className="mb-8">
                  <button
                    onClick={goBack}
                    className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Email
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-gray-600">
                    Enter the verification code sent to {email}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-center rounded-lg bg-red-50 p-4 border border-red-100">
                    <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-2xl font-mono text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the 8 digit code sent to your email
                    </p>
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={loading || !otp}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Verify & Continue
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src="/images/school.jpg"
                  alt="Company Logo"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback =
                      target.parentElement?.querySelector(".fallback-image");
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="fallback-image hidden w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 mx-auto">
                      <Lock className="h-12 w-12 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                      Your Logo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
