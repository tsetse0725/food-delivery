"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";
import LeftSection from "@/app/login/_components/LeftSection";
import RightSection from "@/app/login/_components/RightSection";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <div className="flex h-screen">
      <LeftSection />
      <RightSection src="/signup.png" />
    </div>
  );
}
