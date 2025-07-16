"use client";

import HeroSection from "./_components/HeroSection";
import CategorySection from "./_components/CategorySection";

export default function Home() {
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
