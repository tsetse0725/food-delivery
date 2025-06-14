"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    const emailFromURL = searchParams.get("email");
    if (emailFromURL) {
      setEmail(emailFromURL);
    }
  }, [searchParams]);

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Имэйл олдсонгүй. Буцаж дахин оролдоно уу.");
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE;
      const res = await fetch(`${baseURL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP буруу байна.");
        return;
      }

      router.push(`/reset-password/${data.token}`);
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй.");
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Имэйл олдсонгүй.");
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE;
      const res = await fetch(`${baseURL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Шинэ OTP илгээхэд алдаа гарлаа.");
      } else {
        setSuccess("Шинэ OTP таны имэйлд илгээгдлээ.");
      }
    } catch (err) {
      setError("Сервер алдаа өглөө.");
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
          {success && <p className="text-green-600 text-sm">{success}</p>}

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
