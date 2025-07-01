import { Router } from "express";
import { createOrder, getOrdersByUser } from "../controllers/order.controller";

const router = Router();

// 🛒 Захиалга үүсгэх
router.post("/", createOrder);

// 📦 Хэрэглэгчийн бүх захиалгыг авах
router.get("/:userId", getOrdersByUser);

export default router;
