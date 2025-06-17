// app/add-food/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AddFoodPage() {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return alert("Зураг сонгоно уу");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "foodDelivery");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dridstllg/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImageUrl(data.secure_url);
    alert("📸 Зураг амжилттай upload хийгдлээ!");
  };

  const handleSave = async () => {
    if (!foodName || !price || !imageUrl || !selectedCategory) {
      return alert("Бүх талбарыг бөглөнө үү");
    }

    try {
      await axios.post("http://localhost:8000/foods", {
        foodName,
        price: Number(price),
        image: imageUrl,
        ingredients: "steak, butter, salad",
        category: selectedCategory,
      });

      alert("✅ Хоол амжилттай бүртгэгдлээ!");
    } catch (error) {
      console.error("❌ Food add error:", error);
      alert("Хоол нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">🍜 Хоол нэмэх</h1>

        <input
          type="text"
          placeholder="Хоолны нэр"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full border px-3 py-2 mb-4"
        />

        <input
          type="text"
          placeholder="Үнэ ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-3 py-2 mb-4"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border px-3 py-2 mb-4"
        >
          <option value="">-- Төрөл сонгох --</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border px-3 py-2 mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          📤 Зураг upload хийх
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded mt-4"
        >
          ✅ Хоол бүртгэх
        </button>

        {imageUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">Зураг амжилттай:</p>
            <img
              src={imageUrl}
              alt="food"
              className="w-40 mx-auto rounded-md shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
}
