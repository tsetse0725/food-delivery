"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeftSection() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("Reset link sent to your email!");
    } else {
      alert("Failed to send email.");
    }
  };

  return (
    <div className="p-6 w-full max-w-md mx-auto relative">
      {/* ← Back button */}
      <button
        onClick={() => router.push("/login")}
        className="absolute top-4 left-4 w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <span className="text-xl">←</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 mt-12">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-sm text-gray-600">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
