import Image from "next/image";

export default function RightSection() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="/signup.png"
        alt="Reset password visual"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
