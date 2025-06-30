"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "./UserProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const hidePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/forgot-password/verify-otp",
  ];
  const shouldHide = hidePaths.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;

  useEffect(() => {
    const existingData = localStorage.getItem("cart");
    const cartItems = existingData ? JSON.parse(existingData) : [];
    const totalQty = cartItems.reduce((sum: number, item: any) => sum + item.qty, 0);
    setCartCount(totalQty);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  return (
    <header className="bg-[#121214] text-white px-6 py-4 flex items-center justify-between">
      {/* logo + brand */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="Logo" width={36} height={36} />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-red-500">Nom</span>Nom
          </h1>
          <p className="text-xs text-gray-400">Swift delivery</p>
        </div>
      </Link>

      {/* location selector */}
      <div className="hidden md:flex items-center gap-2 bg-white text-black rounded-full px-4 py-1 text-sm shadow">
        <span className="text-red-500">📍 Delivery address:</span>
        <span className="text-gray-600">Add Location</span>
        <span className="text-gray-400">›</span>
      </div>

      {/* user info + cart + logout */}
      <div className="flex items-center gap-4">
        {/* cart icon */}
        <div className="relative cursor-pointer">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        <span className="text-sm font-semibold text-white">
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
