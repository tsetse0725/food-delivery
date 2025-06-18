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

export default function AppetizerSection() {
  const [appetizers, setAppetizers] = useState([]);

  useEffect(() => {
    const fetchAppetizers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/foods");

        const filtered = res.data
          .filter(
            (item: any) =>
              item.category?.categoryName?.trim().toLowerCase() === "appetizer"
          )
          .slice(0, 3);

        setAppetizers(filtered);
      } catch (err) {
        console.error("❌ Appetizer fetch error:", err);
      }
    };

    fetchAppetizers();
  }, []);

  return (
    <section className="px-8 py-8 bg-[#3d3d3d]">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Appetizer picks
      </h2>

      {appetizers.length === 0 ? (
        <p className="text-white"> Аппетайзер хоол хараахан алга...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {appetizers.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border-[4px] border-white shadow-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.foodName}
                className="w-full h-[180px] object-cover transition-all"
              />
              <div className="p-4">
                <h3 className="text-red-600 font-semibold">{item.foodName}</h3>
                <p className="text-sm text-gray-600">{item.ingredients}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">${item.price.toFixed(2)}</span>
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
