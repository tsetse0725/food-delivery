"use client";

import Image from "next/image";
import { useCart } from "@/app/_context/cartContext";
import { useToast } from "@/app/_context/toastContext"; 
import { useEffect } from "react";

type Props = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
};

export default function FoodCard({ _id, foodName, price, image }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast(); 

  useEffect(() => {
    console.log("useCart context loaded");
  }, []);

  const handleAddToCart = () => {
    console.log(" Add to cart clicked!", _id);

    addToCart({
      foodId: _id,
      name: foodName,
      price,
      image,
      quantity: 1,
    });

    showToast("🍽️ Сагсанд амжилттай нэмэгдлээ!", "success"); 
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
