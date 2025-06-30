"use client";

import Image from "next/image";
import { saveUnitData } from "@/app/utils/cartUtils";

type Props = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
};

export default function FoodCard({ _id, foodName, price, image }: Props) {
  const qty = 1;

  const handleAddToCart = () => {
    saveUnitData("cart", {
      _id,
      foodName,
      price,
      image,
      qty,
    });
  };

  return (
    <div className="bg-white rounded-xl border-[4px] border-yellow-400 shadow p-4">
      <div className="w-full h-48 relative mb-4">
        <Image
          src={image}
          alt={foodName}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h3 className="text-lg font-semibold">{foodName}</h3>
      <p className="text-gray-500">{price.toLocaleString()}₮</p>

      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition"
      >
        + Add to cart
      </button>
    </div>
  );
}
