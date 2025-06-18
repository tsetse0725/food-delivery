"use client";

import { useAuth } from "@/app/_components/UserProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./_components/HeroSection";
import ChickenSection from "./_components/ChickenSection";
import SaladSection from "@/app/_components/SaladSection";
import LunchSection from "./_components/LunchSection";
import AppetizerSection from "./_components/AppetizerSection";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <HeroSection />
      <ChickenSection />
      <SaladSection />
      <LunchSection />
      <AppetizerSection />
    </div>
  );
}
