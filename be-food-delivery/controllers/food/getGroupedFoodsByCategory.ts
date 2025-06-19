import { Request, Response } from "express";
import { FoodModel } from "../../models/Food.model";

export const getGroupedFoodsByCategory = async (req: Request, res: Response) => {
  try {
    const groupedFoods = await FoodModel.aggregate([
      {
        $lookup: {
          from: "foodcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.categoryName",
          foods: {
            $push: {
              _id: "$_id",
              foodName: "$foodName",
              price: "$price",
              image: "$image",
              ingredients: "$ingredients"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 🧠 Object болгон хувиргах (categoryName → foods[])
    const groupedByCategory = groupedFoods.reduce((acc, item) => {
      acc[item._id] = item.foods;
      return acc;
    }, {} as Record<string, any[]>); // Хэрвээ TypeScript-д алдаа өгвөл Record ашиглана

    res.json({ foods: groupedByCategory });

  } catch (err) {
    console.error(" Grouped foods error:", err);
    res.status(500).json({ error: "Failed to get grouped foods" });
  }
};
