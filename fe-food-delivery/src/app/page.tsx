import HeroSection from "./_components/HeroSection";
import ChickenSection from "./_components/ChickenSection";
import SaladSection from "@/app/_components/SaladSection";
import LunchSection from "./_components/LunchSection";
import AppetizerSection from "./_components/AppetizerSection";

export default function Home() {
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
