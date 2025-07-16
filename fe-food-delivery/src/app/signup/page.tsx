
"use client";

import LeftSection from "@/app/signup/_components/LeftSection";
import RightSection from "@/app/signup/_components/RightSection";
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

      <div className="w-full md:w-1/2">
        <LeftSection />
      </div>


      <RightSection src="/signup.png" />
    </div>
  );
}