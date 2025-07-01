import { Request, Response } from "express";
import { FoodOrderModel } from "../models/FoodOrder.model";
import { FoodModel } from "../models/Food.model";

// ✅ Захиалга үүсгэх
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { foodId, quantity, userId } = req.body;

    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ error: "Хоол олдсонгүй" });
    }

    const totalPrice = food.price * quantity;

    const newOrder = await FoodOrderModel.create({
      user: userId,
      totalPrice,
      foodOrderItems: [{ food: foodId, quantity }],
      status: "PENDING",
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(" Захиалга хийхэд алдаа:", error);
    res.status(500).json({ error: "Захиалга амжилтгүй боллоо" });
  }
};

// ✅ Хэрэглэгчийн бүх захиалга авах
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const orders = await FoodOrderModel.find({ user: userId })
      .populate("foodOrderItems.food")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(" Захиалгуудыг авахад алдаа:", error);
    res.status(500).json({ error: "Захиалгуудыг уншиж чадсангүй" });
  }
};
