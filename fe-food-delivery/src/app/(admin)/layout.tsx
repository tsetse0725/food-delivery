"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/_components/UserProvider";
import clsx from "clsx";
import { LayoutGrid, Truck } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();


  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace("/"); 
    }
  }, [user, loading]);


  if (loading || !user || user.role !== "ADMIN") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r p-6 flex flex-col space-y-8">

        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center space-x-2">
            <img src="/Logog.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold">NomNom</h1>
          </div>
          <p className="text-sm text-gray-400">Swift delivery</p>
        </div>


        <nav className="flex flex-col space-y-3">
          <Link
            href="/admin/dishes"
            className={clsx(
              "flex items-center px-4 py-2 rounded-full text-sm font-medium transition",
              pathname.includes("/admin/dishes")
                ? "bg-black text-white"
                : "text-black hover:bg-gray-100"
            )}
          >
            <LayoutGrid className="w-5 h-5 mr-2" />
            Food menu
          </Link>

          <Link
            href="/admin/orders"
            className={clsx(
              "flex items-center px-4 py-2 rounded-full text-sm font-medium transition",
              pathname.includes("/admin/orders")
                ? "bg-black text-white"
                : "text-black hover:bg-gray-100"
            )}
          >
            <Truck className="w-5 h-5 mr-2" />
            Orders
          </Link>
        </nav>
      </aside>


      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}
