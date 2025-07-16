import { Router } from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

/* ─────────────────────────────── */
/* 📦 USER ROUTES                  */
/* ─────────────────────────────── */

// 🟢 POST – хэрэглэгч шинэ захиалга үүсгэх
router.post("/", createOrder);

// 🟢 GET – хэрэглэгч өөрийн захиалгуудыг авах
router.get("/user/:userId", getOrdersByUser);

/* ─────────────────────────────── */
/* 🛠️ ADMIN ROUTES                */
/* ─────────────────────────────── */

// 🔓 GET – админ бүх захиалгыг авах
router.get("/", getAllOrders);

// 🔄 PATCH – админ захиалгын төлөв өөрчлөх
router.patch("/:id", updateOrderStatus);

export default router;
