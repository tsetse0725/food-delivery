"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSubmit: (status: "PENDING" | "DELIVERED" | "CANCELED") => void;
};

export default function ChangeStatusModal({ open, onClose, selectedIds, onSubmit }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<"PENDING" | "DELIVERED" | "CANCELED">("PENDING");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* ❌ Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* 🏷 Title */}
        <h2 className="text-lg font-semibold mb-4">Change delivery state</h2>

        {/* 🔘 Options */}
        <div className="flex gap-2 mb-6">
          {["DELIVERED", "PENDING", "CANCELED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                selectedStatus === status
                  ? status === "DELIVERED"
                    ? "bg-green-100 text-green-700 border-green-500"
                    : status === "CANCELED"
                    ? "bg-red-100 text-red-700 border-red-500"
                    : "bg-yellow-100 text-yellow-700 border-yellow-500"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* 💾 Save */}
        <button
          onClick={() => {
            onSubmit(selectedStatus);
            onClose();
          }}
          className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
