"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/lib.api";
import DishCard from "./DishCard";
import DishesCategorySelector from "./DishesCategorySelector";
import AddDishButton from "./AddDishButton";
import type { Food } from "@/app/types";
import { ToastProvider, useToast } from "@/app/_context/toastContext"; 

type GroupedFood = {
  categoryName: string;
  foods: Food[];
};


function DishesPageContent() {
  const [groupedFoods, setGroupedFoods] = useState<GroupedFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const { showToast } = useToast(); 

  const handleRefresh = () => setRefreshFlag((prev) => !prev);

  const categoryCounts: Record<string, number> = {};
  groupedFoods.forEach((group) => {
    categoryCounts[group.categoryName] = group.foods.length;
  });

  useEffect(() => {
    const fetchGroupedFoods = async () => {
      try {
        const res = await api.get("/foods/grouped");
        const raw = res.data;

        const groupedArray = Object.entries(raw.foods).map(
          ([categoryName, foods]) => ({
            categoryName,
            foods: foods as Food[],
          })
        );

        setGroupedFoods(groupedArray);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
        showToast(" Failed to load foods", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupedFoods();
  }, [refreshFlag]);

  if (loading) return <p className="text-center">Loading...</p>;

  const visibleGroups =
    selectedCategory === null
      ? groupedFoods
      : groupedFoods.filter(
          (g) =>
            g.categoryName.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-2xl font-semibold">All Dishes</h1>

      <DishesCategorySelector
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        categoryCounts={categoryCounts}
      />


      {selectedCategory && !visibleGroups.length && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">{selectedCategory} (0)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AddDishButton
              categoryName={selectedCategory}
              onSuccess={() => {
                handleRefresh();
                showToast(" Dish added successfully");
              }}
            />
          </div>
        </div>
      )}


      {visibleGroups.map((group) => (
        <div key={group.categoryName} className="space-y-4">
          <h2 className="text-xl font-medium">
            {group.categoryName} ({group.foods.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AddDishButton
              categoryName={group.categoryName}
              onSuccess={() => {
                handleRefresh();
                showToast(" Dish added successfully");
              }}
            />
{group.foods.map((food) => (
  <DishCard key={food._id} food={food} onSuccess={handleRefresh} />
))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default function DishesPage() {
  return (
    <ToastProvider>
      <DishesPageContent />
    </ToastProvider>
  );
}
