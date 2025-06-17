import { Request, Response } from "express";
import { FoodCategoryModel } from "../models/FoodCategory.model";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    console.log("📥 POST /categories body →", req.body); // ← input лог

    if (!categoryName) {
      console.warn("⚠️ Төрлийн нэр хоосон байна");
      return res.status(400).json({ message: "Төрлийн нэр заавал хэрэгтэй" });
    }

    const existing = await FoodCategoryModel.findOne({ categoryName });
    if (existing) {
      console.warn("⚠️ Төрөл аль хэдийн нэмэгдсэн байна");
      return res
        .status(400)
        .json({ message: "Төрөл аль хэдийн нэмэгдсэн байна" });
    }

    const newCategory = await FoodCategoryModel.create({ categoryName });

    console.log("✅ Амжилттай нэмэгдсэн төрөл →", newCategory); // ← output лог

    res.status(201).json({
      message: "Төрөл амжилттай нэмэгдлээ",
      category: newCategory,
    });
  } catch (error) {
    console.error("❌ Add category error:", error); // ← алдаа лог
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🟡 Бүх төрлийг авах
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await FoodCategoryModel.find();
    console.log("📤 GET /categories →", categories); // ← лог гаргах
    res.json(categories);
  } catch (error) {
    console.error("❌ Get categories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
