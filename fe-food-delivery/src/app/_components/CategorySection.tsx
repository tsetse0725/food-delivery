"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FoodType {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
}

type Props = {
  categoryName: string;
  limit?: number;
};

export default function CategorySection({ categoryName, limit = 3 }: Props) {
  const [items, setItems] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/foods/grouped");

        const group = res.data.foods?.[categoryName.toLowerCase()] || [];
        setItems(group.slice(0, limit));
      } catch (err) {
        console.error(`❌ ${categoryName} fetch error:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryName, limit]);

  return (
    <section className="px-8 py-8 bg-[#3d3d3d]">
      <h2 className="text-2xl font-semibold text-white mb-6">
        {categoryName} picks
      </h2>

      {loading ? (
        <p className="text-white">Loading {categoryName.toLowerCase()}...</p>
      ) : items.length === 0 ? (
        <p className="text-white">🥺 {categoryName} хоол хараахан алга...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border-6 border-white shadow-lg overflow-hidden"
            >
              {/* 🖼 Зураг + доод баруун буланд + товч */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.foodName}
                  className="w-full h-full object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-white text-red-500 rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:scale-105 transition">
                  +
                </button>
              </div>

              {/* 📝 Хоолны мэдээлэл */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-red-600 font-semibold text-sm">
                    {item.foodName}
                  </h3>
                  <p className="text-sm font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {item.ingredients.length > 60
                    ? item.ingredients.slice(0, 60) + "..."
                    : item.ingredients}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
