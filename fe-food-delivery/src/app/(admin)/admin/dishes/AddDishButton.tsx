"use client";

import { useState } from "react";
import AddDishModal from "./AddDishModal";

type Props = {
  categoryName: string;
  onSuccess?: () => void; 
};

export default function AddDishButton({ categoryName, onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border-2 border-dashed border-red-500 rounded-lg w-[200px] h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition"
      >
        <div className="text-4xl font-bold text-red-500">+</div>
        <p className="text-center text-sm font-medium text-black">
          Add new Dish to <br />
          <strong>{categoryName}</strong>
        </p>
      </div>

      {open && (
        <AddDishModal
          categoryName={categoryName}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);    
            onSuccess?.();     
          }}
        />
      )}
    </>
  );
}
