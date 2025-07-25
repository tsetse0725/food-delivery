import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_components/UserProvider";
import { CartProvider } from "./_context/cartContext";
import { ToastProvider } from "./_context/toastContext";
import { Toaster } from "react-hot-toast"; 

import ClientWrapper from "./_components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🍜 Food delivery",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#404040] text-black`}
      >
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <ClientWrapper>{children}</ClientWrapper>
              <Toaster position="top-center" reverseOrder={false} /> 
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
