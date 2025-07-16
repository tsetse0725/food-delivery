"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  item: {
    _id: string;
    foodName: string;
    price: number;
    image: string;
    ingredients: string[]; 
  };
  isInCart: boolean;
  onClose: () => void;
  onAddToCart: (item: Props["item"], quantity: number) => void;
  onRemoveFromCart: (item: Props["item"]) => void;
}

export default function FoodDetailModal({
  item,
  isInCart,
  onClose,
  onAddToCart,
  onRemoveFromCart,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  const handleRemove = () => {
    onRemoveFromCart(item);
    onClose();
  };


  const ingredientList = item.ingredients.join(", ");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-3xl p-6 flex flex-col md:flex-row gap-6">

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>


        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src={item.image}
            alt={item.foodName}
            fill
            className="object-cover"
          />
        </div>


        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-600">
              {item.foodName}
            </h2>

            <p className="text-gray-600 text-sm mt-1 mb-4">{ingredientList}</p>

            <p className="text-sm text-gray-500">Total price</p>
            <p className="text-xl font-bold mb-4">
              ${Number(item.price * quantity).toFixed(2)}
            </p>


            <div className="flex items-center gap-2 mb-4">
              <button
                className="px-3 py-1 rounded bg-gray-100 text-xl"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                –
              </button>
              <span>{quantity}</span>
              <button
                className="px-3 py-1 rounded bg-gray-100 text-xl"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>


          {isInCart ? (
            <button
              className="bg-gray-300 text-black py-2 rounded-full hover:bg-gray-400 transition"
              onClick={handleRemove}
            >
              Remove from cart
            </button>
          ) : (
            <button
              className="bg-black text-white py-2 rounded-full hover:opacity-90 transition"
              onClick={handleAdd}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
