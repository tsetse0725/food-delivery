"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/lib.api";
import { useCart } from "@/app/_context/cartContext";
import { useToast } from "@/app/_context/toastContext";
import FoodDetailModal from "./FoodDetailModal";
import type { Food } from "@/app/types";

// 🟡 Food from API
type RawFood = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string; // backend-с ирэхдээ string
};

type Props = {
  categoryName: string;
  limit?: number;
};

// 🧠 string → string[] хөрвүүлдэг util
function parseIngredients(input: string): string[] {
  return input.split(",").map((s) => s.trim());
}

export default function CategorySection({ categoryName, limit = 3 }: Props) {
  const [items, setItems] = useState<RawFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RawFood | null>(null);

  const { cart, addToCart, removeFromCart } = useCart();
  const { showToast } = useToast();

  // 🔄 fetch grouped food by category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get("/foods/grouped");
        const group = res.data.foods?.[categoryName.toLowerCase()] || [];
        setItems(group.slice(0, limit));
      } catch (err) {
        console.error(`❌ ${categoryName} fetch error:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryName, limit, cart]);

  return (
    <section className="px-8 py-8 bg-[#3d3d3d] relative">
      <h2 className="text-2xl font-semibold text-white mb-6">
        {categoryName} picks
      </h2>

      {loading ? (
        <p className="text-white">Loading {categoryName.toLowerCase()}...</p>
      ) : items.length === 0 ? (
        <p className="text-white">🥺 {categoryName} хоол хараахан алга...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {items.map((item) => {
            const isInCart = cart.some((c) => c.foodId === item._id);
            const parsedIngredients = parseIngredients(item.ingredients);

            const toggleCart = () => {
              if (isInCart) {
                removeFromCart(item._id);
                showToast(`${item.foodName} removed from cart`);
              } else {
                addToCart({
                  foodId: item._id,
                  name: item.foodName,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                  ingredients: parsedIngredients,
                });
                showToast(`${item.foodName} added to cart!`);
              }
            };

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border-6 border-white shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.foodName}
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={toggleCart}
                    className={`absolute bottom-2 right-2 text-sm bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer ${
                      isInCart ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isInCart ? "✔" : "+"}
                  </div>
                </div>

                <div
                  onClick={() => setSelectedItem(item)}
                  className="p-4 cursor-pointer"
                >
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
                      ? item.ingredients.slice(0, 60) + "…"
                      : item.ingredients}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🧨 FoodDetailModal */}
      {selectedItem && (
        <FoodDetailModal
          item={{
            _id: selectedItem._id,
            foodName: selectedItem.foodName,
            price: selectedItem.price,
            image: selectedItem.image,
            ingredients: parseIngredients(selectedItem.ingredients), // ✅ массив болгож өгнө
          }}
          isInCart={cart.some((c) => c.foodId === selectedItem._id)}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(food, quantity) => {
            addToCart({
              foodId: food._id,
              name: food.foodName,
              price: food.price,
              image: food.image,
              quantity,
              ingredients: food.ingredients,
            });
            showToast(`${food.foodName} added to cart!`);
          }}
          onRemoveFromCart={(food) => {
            removeFromCart(food._id);
            showToast(`${food.foodName} removed from cart`);
          }}
        />
      )}
    </section>
  );
}
