"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";
import LeftSection from "@/app/signup/_components/LeftSection";
import RightSection from "@/app/signup/_components/RightSection";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <div className="flex w-full h-screen mx-auto shadow-lg rounded-lg overflow-hidden">
      <LeftSection />
      <RightSection />
    </div>
  );
}
