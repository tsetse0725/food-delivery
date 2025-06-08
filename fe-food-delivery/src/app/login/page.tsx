import LeftSection from "@/app/login/_components/LeftSection";
import RightSection from "@/app/login/_components/RightSection";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      <LeftSection />
      <RightSection src="/signup.png" />
    </div>
  );
}
