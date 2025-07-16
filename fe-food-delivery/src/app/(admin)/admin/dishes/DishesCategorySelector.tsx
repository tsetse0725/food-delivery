"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/lib.api";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useToast } from "@/app/_context/toastContext"; // ✅ toast context import

type Category = {
  _id: string;
  categoryName: string;
};

type Props = {
  selected: string | null;
  onSelect: (value: string | null) => void;
  categoryCounts: Record<string, number>;
};

export default function DishesCategorySelector({
  selected,
  onSelect,
  categoryCounts,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { showToast } = useToast(); // ✅ toast context ашиглах

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await api.post("/categories", { categoryName: newCategoryName.trim() });
      setNewCategoryName("");
      setShowModal(false);
      fetchCategories();

      showToast("✓ New Category is being added to the menu", "success"); // ✅ success toast
    } catch (err) {
      console.error("Failed to add category", err);
      showToast("Failed to add category", "error"); // ❌ error toast
    }
  };

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Dishes category</h2>

      <div className="flex flex-wrap gap-3">
        {/* All Dishes */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "px-4 py-1.5 rounded-full border text-sm transition font-medium",
            selected === null
              ? "border-gray-300 text-black bg-gray-100"
              : "border-gray-300 text-gray-600 hover:text-black hover:border-black"
          )}
        >
          All Dishes
          <span
            className={cn(
              "ml-2 text-xs font-semibold px-2 py-0.5 rounded-full",
              selected === null
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {totalCount}
          </span>
        </button>

        {/* Category Buttons */}
        {categories.map((cat) => {
          const isSelected = selected === cat.categoryName;
          return (
            <button
              key={cat._id}
              onClick={() => onSelect(cat.categoryName)}
              className={cn(
                "px-4 py-1.5 rounded-full border text-sm transition font-medium capitalize",
                isSelected
                  ? "border-black text-black bg-gray-100"
                  : "border-gray-300 text-gray-600 hover:text-black hover:border-black"
              )}
            >
              {cat.categoryName}
              <span
                className={cn(
                  "ml-2 text-xs font-semibold px-2 py-0.5 rounded-full",
                  isSelected
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {categoryCounts[cat.categoryName] || 0}
              </span>
            </button>
          );
        })}

        {/* + Add Category */}
        <button
          onClick={() => setShowModal(true)}
          className="w-8 h-8 border border-gray-300 rounded-full text-lg font-bold text-gray-600 hover:border-black hover:text-black transition"
        >
          +
        </button>
      </div>

      {/* Popup modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add new category</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input + Button in one row */}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border rounded-md px-4 py-2"
                placeholder="Type category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button
                onClick={handleAddCategory}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Add category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
