"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/lib.api";
import { Category, Food } from "@/app/types";
import { useToast } from "@/app/_context/toastContext";

interface Props {
  food: Food;
  onClose: () => void;
  onSave: (updatedFood: Food) => void;
  onDelete: (foodId: string) => void;
}

export default function EditDishModal({ food, onClose, onSave, onDelete }: Props) {
  const [foodName, setFoodName] = useState(food.foodName);
  const [category, setCategory] = useState(food.categoryName ?? "");
  const [ingredients, setIngredients] = useState(food.ingredients);
  const [price, setPrice] = useState(food.price.toString());
  const [imagePreview, setImagePreview] = useState(food.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        showToast("Failed to fetch categories", "error");
      }
    };
    fetchCategories();
  }, [showToast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("foodName", foodName);
    formData.append("price", price);
    formData.append("ingredients", ingredients);
    formData.append("categoryName", category);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await api.patch(`/foods/${food._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave(res.data.food);
      showToast("Dish updated successfully", "success");
      onClose();
    } catch (error) {
      showToast("Failed to update dish", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/foods/${food._id}`);
      onDelete(food._id);
      showToast("Dish deleted", "success");
      onClose();
    } catch (error) {
      showToast("Failed to delete dish", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Dishes info</h2>

        <label className="block text-sm font-medium">Dish name</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <label className="block text-sm font-medium">Dish category</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium">Ingredients</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <label className="block text-sm font-medium">Price</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          type="text"
          pattern="^\d+(\.\d{0,2})?$"
          value={price}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*(\.\d{0,2})?$/.test(val)) {
              setPrice(val);
            }
          }}
        />

        <label className="block text-sm font-medium">Image</label>
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={400}
            height={250}
            className="rounded-lg mb-2 object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 border border-dashed border-gray-300 rounded px-3 py-2"
        />

        <div className="flex justify-between mt-4">
          <button
            className="bg-red-100 text-red-600 px-4 py-2 rounded border border-red-300 hover:bg-red-200"
            onClick={handleDelete}
          >
            🗑 Delete
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}