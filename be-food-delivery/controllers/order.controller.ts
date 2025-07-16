import { Request, Response } from "express";
import { FoodOrderModel } from "../models/FoodOrder.model";
import { FoodModel } from "../models/Food.model";


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, deliveryAddress } = req.body;


    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Захиалгын хоол байхгүй байна" });
    }

    let totalPrice = 0;
    const foodOrderItems = [];

    for (const item of items) {
      const food = await FoodModel.findById(item.foodId);
      if (!food) {
        console.warn(`Food not found with ID: ${item.foodId}`);
        continue;
      }

      totalPrice += food.price * item.quantity;
      foodOrderItems.push({
        food: item.foodId,
        quantity: item.quantity,
      });
    }

    const shippingFee = parseFloat(process.env.SHIPPING_FEE || "0");
    const total = totalPrice + shippingFee;

    const newOrder = await FoodOrderModel.create({
      user: userId,
      totalPrice: total,
      deliveryAddress,
      foodOrderItems,
      status: "PENDING",
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Захиалга хийхэд алдаа:", error);
    res.status(500).json({ error: "Захиалга амжилтгүй боллоо" });
  }
};


export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const orders = await FoodOrderModel.find({ user: userId })
      .populate("foodOrderItems.food")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Захиалгуудыг авахад алдаа:", error);
    res.status(500).json({ error: "Захиалгуудыг уншиж чадсангүй" });
  }
};


export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await FoodOrderModel.find()
      .populate("foodOrderItems.food")
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Бүх захиалга авахад алдаа:", error);
    res.status(500).json({ error: "Захиалгуудыг татаж чадсангүй" });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const status = req.body.status?.toUpperCase();

    if (!["PENDING", "CANCELED", "DELIVERED"].includes(status)) {
      return res.status(400).json({ error: "Буруу төлөв байна" });
    }

    const updated = await FoodOrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Захиалга олдсонгүй" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Төлөв шинэчлэхэд алдаа:", error);
    res.status(500).json({ error: "Төлөв шинэчлэхэд алдаа гарлаа" });
  }
};
