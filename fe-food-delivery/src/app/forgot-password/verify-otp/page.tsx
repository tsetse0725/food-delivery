"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const { user, loading } = useAuth();

  // 🔒 Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  // 📦 Get email from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("reset-email");
    console.log("📦 stored email →", stored);
    if (stored) setEmail(stored.trim());
  }, []);

  // ✅ Verify OTP
  const handleVerify = async () => {
    setError("");

    if (!email) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE;
      console.log("🌐 API Base URL:", baseURL);

      if (!baseURL) {
        setError("API base URL is not defined");
        return;
      }

      const res = await fetch(`${baseURL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: otp,
        }),
      });

      if (!res.ok) {
        const errRes = await res.json();
        setError(errRes.message || "Invalid OTP");
        return;
      }

      const data = await res.json();
      router.push(`/reset-password/${data.token}`);
    } catch (err) {
      console.error("❌ OTP Error:", err);
      setError("Something went wrong while verifying OTP.");
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    if (!email) return;

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE;
      if (!baseURL) {
        console.warn("⛔ No API base URL");
        return;
      }

      const res = await fetch(`${baseURL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (!res.ok) {
        console.warn("❌ Resend OTP failed");
      }
    } catch (err) {
      console.error("❌ Resend error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xl w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
          >
            ←
          </button>

          <h1 className="text-2xl font-bold">Enter OTP</h1>

          <input
            type="text"
            placeholder="6-digit OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={!otp || otp.length !== 6}
            className={`w-full py-2 rounded font-semibold transition ${
              !otp || otp.length !== 6
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Verify OTP
          </button>

          <button
            onClick={handleResend}
            className="text-sm text-blue-500 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <img
          src="/signup.png"
          alt="OTP verification"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
