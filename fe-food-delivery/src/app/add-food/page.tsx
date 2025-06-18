"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function AddFoodPage() {
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(" Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
    alert(" Зураг амжилттай upload хийгдлээ!");
  };

  const formik = useFormik({
    initialValues: {
      foodName: "",
      price: "",
      ingredients: "",
      category: "",
    },
    validationSchema: Yup.object({
      foodName: Yup.string().required("Хоолны нэр шаардлагатай"),
      price: Yup.number()
        .typeError("Үнэ зөвхөн тоо байх ёстой")
        .positive("Үнэ эерэг тоо байх ёстой")
        .required("Үнэ шаардлагатай"),
      ingredients: Yup.string().required("Орц оруулна уу"),
      category: Yup.string().required("Төрөл сонгоно уу"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!imageUrl) {
        alert("Зураг upload хийгдээгүй байна");
        return;
      }

      try {
        await axios.post("http://localhost:8000/foods", {
          ...values,
          price: Number(values.price),
          image: imageUrl,
        });
        alert("✅ Хоол амжилттай бүртгэгдлээ!");
        resetForm();
        setImageUrl("");
        setFile(null);
      } catch (error: any) {
        console.error("❌ Food add error:", error);
        if (error.response?.data?.message?.includes("аль хэдийн")) {
          alert("❗️ Энэ нэртэй хоол бүртгэгдсэн байна.");
        } else {
          alert("❌ Хоол нэмэхэд алдаа гарлаа.");
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 shadow-md rounded-md max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">🍜 Хоол нэмэх</h1>

        <input
          type="text"
          name="foodName"
          placeholder="Хоолны нэр"
          value={formik.values.foodName}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 mb-1"
        />
        {formik.touched.foodName && formik.errors.foodName && (
          <p className="text-sm text-red-500 mb-2">{formik.errors.foodName}</p>
        )}

        <input
          type="text"
          name="price"
          placeholder="Үнэ ($)"
          value={formik.values.price}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 mb-1"
        />
        {formik.touched.price && formik.errors.price && (
          <p className="text-sm text-red-500 mb-2">{formik.errors.price}</p>
        )}

        <input
          type="text"
          name="ingredients"
          placeholder="Орц (ж: steak, salad, rice)"
          value={formik.values.ingredients}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 mb-1"
        />
        {formik.touched.ingredients && formik.errors.ingredients && (
          <p className="text-sm text-red-500 mb-2">
            {formik.errors.ingredients}
          </p>
        )}

        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 mb-1"
        >
          <option value="">-- Төрөл сонгох --</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-sm text-red-500 mb-2">{formik.errors.category}</p>
        )}

        <input
          type="file"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              const validTypes = ["image/png", "image/jpeg", "image/jpg"];
              if (!validTypes.includes(selected.type)) {
                alert("❌ Зөвхөн зураг (jpg, png) сонгоно уу.");
                return;
              }
              setFile(selected);
            }
          }}
          className="w-full border px-3 py-2 mb-4"
        />

        <button
          type="button"
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          📤 Зураг upload хийх
        </button>

        <button
          type="submit"
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
      </form>
    </div>
  );
}
