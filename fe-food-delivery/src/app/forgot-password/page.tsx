"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("Reset link sent!");
    } else {
      alert("Failed to send reset link.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          {/* ← Back button */}
          <button
            onClick={() => router.push("/login")}
            className="w-8 h-8 rounded-[5%] border flex items-center justify-center bg-white shadow hover:bg-gray-100 transition"
            aria-label="Back to Login"
          >
            <span className="text-xl">←</span>
          </button>

          {/* Reset form */}
          <h2 className="text-2xl font-bold">Reset your password</h2>
          <p className="text-sm text-gray-500">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right side: image */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/signup.png"
          alt="Forgot Password"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
