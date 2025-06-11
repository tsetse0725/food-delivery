"use client";

import LeftSection from "../_components/LeftSection";
import RightSection from "../_components/RightSection";
import { useAuth } from "../_components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user]);

  return (
    <div className="flex min-h-screen">
      {/* Зүүн талын зурагтай хэсэг */}
      <div className="w-1/2 hidden md:block">
        <LeftSection />
      </div>

      {/* Баруун талын бүртгүүлэх form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-gray-600 mb-6">
          Sign up to start ordering your favorite food.
        </p>
        <RightSection />
      </div>
    </div>
  );
}
