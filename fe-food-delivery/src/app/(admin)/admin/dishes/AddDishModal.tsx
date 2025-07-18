"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { api } from "@/lib/lib.api";
import { useState } from "react";

type Props = {
  categoryName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddDishModal({ categoryName, onClose, onSuccess }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      foodName: "",
      price: "",
      ingredients: "",
      image: null as File | null,
    },
    validationSchema: yup.object({
      foodName: yup.string().required("Food name is required"),
      price: yup
        .number()
        .required("Price is required")
        .typeError("Price must be a number")
        .min(0, "Price cannot be negative"),
      ingredients: yup.string().required("Ingredients are required"),
      image: yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("foodName", values.foodName);
      formData.append("price", values.price.toString());
      formData.append("ingredients", values.ingredients);
      formData.append("categoryName", categoryName);
      formData.append("image", values.image as File);

      try {
        await api.post("/foods", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });


        onSuccess?.();
      } catch (error) {
        console.error(" Failed to add food:", error);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add new Dish to {categoryName}</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>


        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Food name</label>
              <input
                name="foodName"
                className="border px-3 py-2 rounded w-full"
                placeholder="e.g., Chicken Salad"
                onChange={formik.handleChange}
                value={formik.values.foodName}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                name="price"
                type="text"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                placeholder="e.g., 8.99"
                className="border px-3 py-2 rounded w-full"
                onChange={formik.handleChange}
                value={formik.values.price}
                onKeyDown={(e) => {
                  const allowed = ['0','1','2','3','4','5','6','7','8','9','.','Backspace','Delete','ArrowLeft','ArrowRight','Tab'];
                  if (!allowed.includes(e.key)) e.preventDefault();
                  if (e.key === '.' && e.currentTarget.value.includes('.')) e.preventDefault();
                }}
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Ingredients</label>
            <input
              name="ingredients"
              className="border px-3 py-2 rounded w-full"
              placeholder="e.g., chicken, lettuce, mayo..."
              onChange={formik.handleChange}
              value={formik.values.ingredients}
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Food image</label>
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-black transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16v-8m0 0l-4 4m4-4l4 4m6 4v-4a2 2 0 00-2-2h-2l-2-2H8l-2 2H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2z"
                    />
                  </svg>
                  <p>
                    <span className="font-medium">Click to upload</span> or drag & drop
                  </p>
                </div>
              )}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>


          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition"
          >
            Add Dish
          </button>
        </form>
      </div>
    </div>
  );
}
