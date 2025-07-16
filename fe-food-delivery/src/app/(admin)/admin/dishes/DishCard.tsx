"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useState } from "react";
import EditDishModal from "./EditDishModal"; // ⬅️ popup modal

import type { Food } from "@/app/types";

type Props = {
  food: Food;
  onSuccess: () => void; // ⬅️ refresh хийлгэх функц
};

export default function DishCard({ food, onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative group rounded-lg overflow-hidden shadow-sm border cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={food.image}
          alt={food.foodName}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
          <Pencil size={16} />
        </div>
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-semibold text-red-600">{food.foodName}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{food.ingredients}</p>
          <p className="text-sm font-medium">${food.price.toFixed(2)}</p>
        </div>
      </div>

      {/* 🟢 Modal нээгдэх нөхцөл */}
      {open && (
<EditDishModal
  food={food}
  onClose={() => setOpen(false)}
  onSave={onSuccess}
  onDelete={onSuccess}
/>
      )}
    </>
  );
}
