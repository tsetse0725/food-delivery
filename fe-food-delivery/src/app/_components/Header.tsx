"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const hidePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/forgot-password/verify-otp",
  ];
  const shouldHide = hidePaths.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <header className="bg-[#121214] text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="Logo" width={36} height={36} />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-red-500">Nom</span>Nom
          </h1>
          <p className="text-xs text-gray-400">Swift delivery</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-white text-black rounded-full px-4 py-1 text-sm shadow">
        <span className="text-red-500">📍 Delivery address:</span>
        <span className="text-gray-600">Add Location</span>
        <span className="text-gray-400">›</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-white">Test@gmail.com</span>
        <button className="bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition">
          Log out
        </button>
      </div>
    </header>
  );
}
