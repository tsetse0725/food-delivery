"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./UserProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const hidePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/forgot-password/verify-otp",
  ];
  const shouldHide = hidePaths.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // ❌ context хэрэглэгчийг устгана
    router.replace("/login"); // ⏩ шууд /login руу үсэрнэ
  };

  return (
    <header className="bg-[#121214] text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="Logo" width={36} height={36} />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-red-500">Nom</span>Nom
          </h1>
          <p className="text-xs text-gray-400">Swift delivery</p>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-2 bg-white text-black rounded-full px-4 py-1 text-sm shadow">
        <span className="text-red-500">📍 Delivery address:</span>
        <span className="text-gray-600">Add Location</span>
        <span className="text-gray-400">›</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-white">
          {user?.email || "Not logged in"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
