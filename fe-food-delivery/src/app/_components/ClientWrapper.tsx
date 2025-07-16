"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/forgot-password/verify-otp",
  ];

  const hideLayout =
    noLayoutPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/admin"); 

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
