import { Request, Response } from "express";
import { FoodModel } from "../../models/Food.model";
import { FoodCategoryModel } from "../../models/FoodCategory.model";
import { cloudinary } from "../../utils/cloudinary";
import streamifier from "streamifier";

/* 🔎 GET /foods – Бүх хоол */
export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await FoodModel.find().populate("category", "categoryName");
    res.json(foods);
  } catch (error) {
    console.error("Food fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ➕ POST /foods – Шинэ хоол нэмэх */
export const addNewFood = async (req: Request, res: Response) => {
  try {
    const { foodName, price, ingredients, categoryName } = req.body;
    const file = req.file;

    if (!foodName || !price || !ingredients || !categoryName || !file) {
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
    }

    const existing = await FoodModel.findOne({ foodName });
    if (existing) {
      return res.status(400).json({ message: "Нэр давхцаж байна" });
    }

    const category = await FoodCategoryModel.findOne({ categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category олдсонгүй" });
    }

    const streamUpload = (): Promise<{ secure_url: string }> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "food-delivery" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    const newFood = await FoodModel.create({
      foodName,
      price: Number(price),
      ingredients,
      category: category._id,
      image: result.secure_url,
    });

    res.status(201).json({ message: "Амжилттай", food: newFood });
  } catch (error) {
    console.error("Food create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* 🔎 GET /foods/:id */
export const getFoodById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const food = await FoodModel.findById(id).populate("category", "categoryName");
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (error) {
    console.error("Get food error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* 🔁 PATCH /foods/:id */
export const updateFood = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { foodName, price, ingredients, categoryName } = req.body;
  const file = req.file;

  try {
    const food = await FoodModel.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const category = await FoodCategoryModel.findOne({ categoryName });
    if (!category) return res.status(404).json({ message: "Category not found" });

    let imageUrl = food.image;

    if (file) {
      const streamUpload = (): Promise<{ secure_url: string }> =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "food-delivery" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as { secure_url: string });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    food.foodName = foodName || food.foodName;
    food.price = price || food.price;
    food.ingredients = ingredients || food.ingredients;
    food.category = category._id;
    food.image = imageUrl;

    await food.save();

    res.json({ message: "Food updated", food });
  } catch (error) {
    console.error("Update food error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ❌ DELETE /foods/:id */
export const deleteFood = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const food = await FoodModel.findByIdAndDelete(id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Delete food error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
