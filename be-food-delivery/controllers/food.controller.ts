import { Request, Response } from "express";
import { FoodModel } from "../models/Food.model";

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await FoodModel.find().populate("category", "categoryName");
    res.json(foods);
  } catch (error) {
    console.error(" Food fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addNewFood = async (req: Request, res: Response) => {
  try {
    const { foodName, price, image, ingredients, category } = req.body;

    //  Хоосон талбар шалгах
    if (!foodName || !price || !image || !category) {
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
    }

    //  Давхардал шалгах
    const existing = await FoodModel.findOne({ foodName });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Энэ нэртэй хоол аль хэдийн бүртгэгдсэн байна" });
    }

    // Хоол үүсгэх
    const newFood = await FoodModel.create({
      foodName,
      price,
      image,
      ingredients,
      category,
    });

    res.status(201).json({
      message: "Хоол амжилттай нэмэгдлээ",
      food: newFood,
    });
  } catch (error) {
    console.error(" Food create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
