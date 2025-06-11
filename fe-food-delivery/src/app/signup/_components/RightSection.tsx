"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RightSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Signup failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <input
        type="email"
        placeholder="Enter your email or phone number"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Sign up
      </button>

      <p className="text-sm text-center mt-2">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Log in
        </span>
      </p>
    </form>
  );
}
