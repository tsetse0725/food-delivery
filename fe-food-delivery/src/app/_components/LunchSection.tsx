"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LunchSection() {
  const [lunchItems, setLunchItems] = useState([]);

  useEffect(() => {
    const fetchLunch = async () => {
      try {
        const res = await axios.get("http://localhost:8000/foods");
        console.log("📦 ALL foods from backend →", res.data);

        const filtered = res.data.filter(
          (item: any) =>
            item.category?.categoryName?.trim().toLowerCase() === "lunch"
        );
        console.log("🥗 Filtered Lunch only →", filtered);

        setLunchItems(filtered);
      } catch (err) {
        console.error("❌ Lunch fetch error:", err);
      }
    };

    fetchLunch();
  }, []);

  console.log("🍽 lunchItems in JSX render →", lunchItems);

  return (
    <section className="px-8 py-8 bg-[#3d3d3d]">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Lunch favorites
      </h2>

      {lunchItems.length === 0 ? (
        <p className="text-white">😢 Lunch хоол байхгүй байна.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {lunchItems.map((lunch: any) => (
            <div
              key={lunch._id}
              className="bg-white rounded-xl border-[4px] border-white shadow-md overflow-hidden"
            >
              <img
                src={lunch.image}
                alt={lunch.foodName}
                className="w-full h-[180px] object-cover transition-all"
              />
              <div className="p-4">
                <h3 className="text-red-600 font-semibold">{lunch.foodName}</h3>
                <p className="text-sm text-gray-600">{lunch.ingredients}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">${lunch.price.toFixed(2)}</span>
                  <button className="bg-red-500 text-white w-6 h-6 rounded-full">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
