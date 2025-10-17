"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SuccessOrderModal({ open, onClose }: Props) {
  const router = useRouter();

  if (!open) return null;

const handleBackHome = () => {
  window.location.href = "/"; 
};

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center relative shadow-lg min-h-[400px] flex flex-col justify-center items-center">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>


        <h2 className="text-lg font-semibold mb-4">
          Your order has been successfully placed !
        </h2>


        <div className="w-[160px] h-[160px] relative mb-6">
          <Image
            src="/order-success.png"
            alt="Order Success"
            fill
            className="object-contain"
          />
        </div>


        <button
          onClick={handleBackHome}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-6 py-2 rounded-full"
        >
          Back to home.
        </button>
      </div>
    </div>
  );
}
