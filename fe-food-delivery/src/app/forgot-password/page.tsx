// 📁 app/forgot-password/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";


const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  /* ─── Имэйл Regex шалгалт ─── */
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /* ─── Форм submit ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      /* 🔗 localhost хатуу бичихийн оронд API_BASE ашиглана */
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        /* OTP илгээгдсэн тул verify хуудас руу имэйлтэйгээ дамжуулна */
        router.push(
          `/forgot-password/verify-otp?email=${encodeURIComponent(email)}`
        );
      } else {
        /* Backend-ийн message-ийг шууд үзүүлнэ (ж.нь. “User not found”) */
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Network error – OTP илгээж чадсангүй.");
    }
  };

  /* ─── UI ─── */
  return (
    <div className="flex h-screen bg-white text-black">
      {/* Зүүн тал (форм) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          {/* Буцах товч */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xl w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
            aria-label="Back"
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

          {/* Алдаа гарах үед */}
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

      {/* Баруун тал – зураг */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/signup.png"
          alt="Reset illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
