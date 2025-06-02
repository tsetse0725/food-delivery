import LeftSection from "@/app/signup/_components/LeftSection";
import RightSection from "@/app/signup/_components/RightSection";

export default function SignupPage() {
  return (
    <div className="flex w-full h-screen mx-auto shadow-lg rounded-lg overflow-hidden">
      <LeftSection />
      <RightSection />
    </div>
  );
}
