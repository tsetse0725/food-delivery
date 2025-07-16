"use client";

import { useState } from "react";
import { api } from "@/lib/lib.api";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onCategoryAdded: () => void;
};

export default function AddCategoryModal({ onClose, onCategoryAdded }: Props) {
  const [categoryName, setCategoryName] = useState("");

  const handleAdd = async () => {
    if (!categoryName.trim()) return;

    try {
      await api.post("/categories", { categoryName });
      onCategoryAdded(); 
      onClose();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add new category</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          className="w-full border rounded-md px-4 py-2 mb-4"
          placeholder="Type category name..."
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Add category
        </button>
      </div>
    </div>
  );
}
