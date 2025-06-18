"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface LunchType {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
}

export default function LunchSection() {
  const [lunchItems, setLunchItems] = useState<LunchType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLunch = async () => {
      try {
        const res = await axios.get("http://localhost:8000/foods/grouped");
        const group = res.data.find(
          (g: any) => g._id?.toLowerCase() === "lunch"
        );
        setLunchItems(group?.foods || []);
      } catch (err) {
        console.error("❌ Lunch fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLunch();
  }, []);

  return (
    <section className="px-8 py-8 bg-[#3d3d3d]">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Lunch favorites
      </h2>

      {loading ? (
        <p className="text-white">Loading lunch...</p>
      ) : lunchItems.length === 0 ? (
        <p className="text-white">😢 Lunch хоол байхгүй байна.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {lunchItems.map((lunch) => (
            <div
              key={lunch._id}
              className="bg-white rounded-2xl border-6 border-white shadow-lg overflow-hidden"
            >
              <div className="w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                <img
                  src={lunch.image}
                  alt={lunch.foodName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-red-600 font-semibold text-sm">
                    {lunch.foodName}
                  </h3>
                  <p className="text-sm font-semibold">
                    ${lunch.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {lunch.ingredients.length > 60
                    ? lunch.ingredients.slice(0, 60) + "..."
                    : lunch.ingredients}
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
      )}
    </section>
  );
}
