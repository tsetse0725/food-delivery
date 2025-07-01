"use client";

import { useAuth } from "@/app/_components/UserProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./_components/HeroSection";
import CategorySection from "./_components/CategorySection";

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
<CategorySection categoryName="appetizer" limit={3} />
<CategorySection categoryName="lunch" limit={6} />
<CategorySection categoryName="chicken" limit={6} />
<CategorySection categoryName="salad" limit={3} />

    </div>
  );
}
