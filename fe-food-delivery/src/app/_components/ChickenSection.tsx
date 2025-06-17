"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FoodType {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: {
    _id: string;
    categoryName: string;
  };
}

export default function ChickenSection() {
  const [foods, setFoods] = useState<FoodType[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await axios.get("http://localhost:8000/foods");
      const chickenFoods = res.data.filter(
        (food: FoodType) =>
          food.category?.categoryName?.toLowerCase() === "chicken"
      );
      setFoods(chickenFoods);
    };
    fetchFoods();
  }, []);

  return (
    <div className="bg-[#404040] text-white px-10 py-12">
      <h2 className="text-2xl font-semibold mb-8">Chicken</h2>
      <div className="grid grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white text-black rounded-2xl border-6 border-white shadow-lg overflow-hidden"
          >
            <div className="w-full aspect-[16/9] overflow-hidden rounded-t-xl">
              <img
                src={food.image}
                alt={food.foodName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-red-500 font-semibold text-sm">
                  {food.foodName}
                </h3>
                <p className="text-sm font-semibold">
                  ${food.price.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-600">
                {food.ingredients.length > 60
                  ? food.ingredients.slice(0, 60) + "..."
                  : food.ingredients}
              </p>
            </div>
            <div className="flex justify-end px-4 pb-4">
              <button className="bg-red-500 text-white rounded-full px-[9px] text-sm">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
