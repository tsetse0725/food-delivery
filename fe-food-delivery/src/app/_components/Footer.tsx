"use client";

import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#121214] text-white mt-10">
      <div className="bg-[#f44336] text-white text-center py-3 text-lg font-semibold uppercase tracking-wide">
        Fresh fast delivered • Fresh fast delivered • Fresh fast delivered
      </div>

      <div className="px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div className="space-y-2">
          <Image src="/logo.jpg" alt="Logo" width={36} height={36} />
          <div>
            <h2 className="text-xl font-bold">
              <span className="text-red-500">Nom</span>Nom
            </h2>
            <p className="text-xs text-gray-400">Swift delivery</p>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 uppercase text-xs font-semibold mb-2">
            NomNom
          </h3>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Contact us</li>
            <li>Delivery zone</li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 uppercase text-xs font-semibold mb-2">
            Menu
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ul className="space-y-1">
              <li>Appetizers</li>
              <li>Salads</li>
              <li>Pizzas</li>
              <li>Main dishes</li>
              <li>Desserts</li>
            </ul>
            <ul className="space-y-1">
              <li>Side dish</li>
              <li>Brunch</li>
              <li>Desserts</li>
              <li>Beverages</li>
              <li>Fish & Sea foods</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 uppercase text-xs font-semibold mb-2">
            Follow Us
          </h3>
          <div className="flex items-center gap-4">
            <Facebook size={20} />
            <Instagram size={20} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-gray-500 text-xs text-center px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <span className="md:col-span-1">Copyright 2024 © Nomnom LLC</span>
        <span className="text-center">Privacy policy</span>
        <span className="text-center">Terms and condition</span>
        <span className="text-center">Cookie policy</span>
      </div>
    </footer>
  );
}
