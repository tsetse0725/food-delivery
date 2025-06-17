"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SaladSection() {
  const [salads, setSalads] = useState([]);

  useEffect(() => {
    const fetchSalads = async () => {
      try {
        const res = await axios.get("http://localhost:8000/foods");
        const filtered = res.data.filter(
          (item: any) =>
            item.category?.categoryName?.toLowerCase() === "salad"
        );
        setSalads(filtered);
      } catch (err) {
        console.error("❌ Salad fetch error:", err);
      }
    };
    fetchSalads();
  }, []);

  return (
    <section className="px-8 py-8 bg-[#404040]">
      <h2 className="text-2xl font-semibold text-white mb-6">Salads</h2>
      <div className="grid grid-cols-3 gap-6">
        {salads.map((salad: any) => (
      <div
  key={salad._id}
  className="bg-white rounded-xl shadow-xl border-6  border-white overflow-hidden"
>
            <img
              src={salad.image}
              alt={salad.foodName}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-4">
              <h3 className="text-red-600 font-semibold">{salad.foodName}</h3>
              <p className="text-sm text-gray-600">{salad.ingredients}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">${salad.price.toFixed(2)}</span>
                <button className="bg-red-500 text-white w-6 h-6 rounded-full">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
