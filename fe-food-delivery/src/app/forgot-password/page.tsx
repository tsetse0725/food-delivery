"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Failed to send OTP");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xl w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
          >
            ←
          </button>

          <h2 className="text-2xl font-bold">Reset your password</h2>
          <p className="text-sm text-gray-600">
            Enter your email to receive a password reset link.
          </p>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full border px-4 py-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isValidEmail(email)}
            className={`w-full py-2 rounded font-semibold transition ${
              !isValidEmail(email)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Send link
          </button>

          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <img
          src="/signup.png"
          alt="Reset confirmation"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
