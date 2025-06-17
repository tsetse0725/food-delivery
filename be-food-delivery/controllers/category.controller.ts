import { Request, Response } from "express";
import { FoodCategoryModel } from "../models/FoodCategory.model";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Төрлийн нэр шаардлагатай" });
    }

    // 🛡 Давхцал шалгах
    const exists = await FoodCategoryModel.findOne({
      categoryName: categoryName.trim().toLowerCase(),
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Энэ төрлийн нэр аль хэдийн бүртгэгдсэн байна" });
    }

    const newCategory = await FoodCategoryModel.create({
      categoryName: categoryName.trim().toLowerCase(),
    });

    res
      .status(201)
      .json({ message: "Төрөл амжилттай нэмэгдлээ", category: newCategory });
  } catch (err) {
    console.error("❌ Add category error:", err);
    res.status(500).json({ message: "Дотоод серверийн алдаа" });
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
